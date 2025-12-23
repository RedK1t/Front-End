import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useRef,
} from "react";

export type HttpValidatedData = {
  subdomain: string;
  url: string;
  status: number;
  ips: string[];
};

export type DnsOnlyData = {
  subdomain: string;
  ips: string[];
};

export type ScanState = {
  httpSubdomains: HttpValidatedData[];
  dnsSubdomains: DnsOnlyData[];
  progress: number;
  numberOfResults: number;
  elapsedTime: number;
  isScanning: boolean;
};

const defaultScanState: ScanState = {
  httpSubdomains: [],
  dnsSubdomains: [],
  progress: 0,
  numberOfResults: 0,
  elapsedTime: 0,
  isScanning: false,
};

type SubdomainContextType = {
  scanData: Record<string, ScanState>;
  startScan: (domain: string) => void;
  stopScan: (domain: string) => void;
};

const SubdomainContext = createContext<SubdomainContextType | undefined>(
  undefined,
);

export function SubdomainProvider({ children }: { children: ReactNode }) {
  const [scanData, setScanData] = useState<Record<string, ScanState>>({});
  const socketsRef = useRef<Record<string, WebSocket>>({});

  const startScan = useCallback((domain: string) => {
    if (!domain) return;

    // If already scanning, don't start again
    if (
      socketsRef.current[domain] &&
      socketsRef.current[domain].readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    const url = import.meta.env.VITE_subdomains_websocket_url;
    if (!url) {
      console.error("VITE_subdomains_websocket_url is not defined");
      return;
    }

    // Initialize/Reset data for this domain on new scan
    setScanData((prev) => ({
      ...prev,
      [domain]: { ...defaultScanState, isScanning: true },
    }));

    const ws = new WebSocket(url);
    socketsRef.current[domain] = ws;

    ws.onopen = () => {
      console.log("WebSocket connected for", domain);
      ws.send(
        JSON.stringify({
          domain: domain,
          wordlist_preset: "2",
          passive: true,
          timeout: 5.0,
          threads: 50,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setScanData((prev) => {
        const current = prev[domain] || defaultScanState;

        let nextHttp = current.httpSubdomains;
        let nextDns = current.dnsSubdomains;
        let nextProgress = current.progress;
        let nextCount = current.numberOfResults;
        let nextTime = current.elapsedTime;
        let nextScanning = current.isScanning;

        if (data.type === "progress") {
          nextProgress = data.percentage;
        } else if (data.type === "http_validated") {
          nextHttp = [
            ...nextHttp,
            {
              subdomain: data.subdomain,
              url: data.url,
              status: data.status,
              ips: data.ips,
            },
          ];
        } else if (data.type === "dns_only") {
          nextDns = [...nextDns, { subdomain: data.subdomain, ips: data.ips }];
        } else if (data.type === "complete") {
          nextCount = data.count;
          nextTime = data.elapsed_time;
          nextScanning = false;
        }

        return {
          ...prev,
          [domain]: {
            httpSubdomains: nextHttp,
            dnsSubdomains: nextDns,
            progress: nextProgress,
            numberOfResults: nextCount,
            elapsedTime: nextTime,
            isScanning: nextScanning,
          },
        };
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setScanData((prev) => ({
        ...prev,
        [domain]: { ...(prev[domain] || defaultScanState), isScanning: false },
      }));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected for", domain);
      setScanData((prev) => ({
        ...prev,
        [domain]: { ...(prev[domain] || defaultScanState), isScanning: false },
      }));
    };
  }, []);

  const stopScan = useCallback((domain: string) => {
    const ws = socketsRef.current[domain];
    if (ws) {
      ws.close();
      delete socketsRef.current[domain];
    }
    setScanData((prev) => ({
      ...prev,
      [domain]: { ...(prev[domain] || defaultScanState), isScanning: false },
    }));
  }, []);

  return (
    <SubdomainContext.Provider value={{ scanData, startScan, stopScan }}>
      {children}
    </SubdomainContext.Provider>
  );
}

export function useSubdomainContext() {
  const context = useContext(SubdomainContext);
  if (!context) {
    throw new Error(
      "useSubdomainContext must be used within a SubdomainProvider",
    );
  }
  return context;
}
