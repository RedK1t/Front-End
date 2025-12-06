import type { subdomainData } from "@/types/types";
import { useEffect, useState } from "react";

export default function useSubdomains(domain: string) {
  const [httpSubdomains, setHttpSubdomains] = useState<subdomainData[]>([]);
  const [dnsSubdomains, setDnsSubdomains] = useState<subdomainData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [numberOfResults, setNumberOfResults] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const url = import.meta.env.VITE_subdomains_websocket_url;
  type progressMessage = {
    type: "progress";

    percentage: number;
    completed: number;
    total: number;
  };
  type httpValidatedMessage = {
    type: "http_validated";

    subdomain: string;
    url: string;
    status: number;
    ips: string[];
  };
  type dnsOnlyMessage = {
    type: "dns_only";

    subdomain: string;
    ips: string[];
  };
  type completeMessage = {
    type: "complete";

    count: number;
    elapsed_time: number;
  };
  type data =
    | progressMessage
    | httpValidatedMessage
    | dnsOnlyMessage
    | completeMessage;
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connected");
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

    ws.onmessage = (event: MessageEvent) => {
      const data: data = JSON.parse(event.data);
      console.log(event.data);
      if (data.type === "progress") {
        setProgress(data.percentage);
      }
      if (data.type === "http_validated") {
        setHttpSubdomains((prev) => [
          ...prev,
          { host: data.subdomain, ips: data.ips },
        ]);
      }
      if (data.type === "dns_only") {
        setDnsSubdomains((prev) => [
          ...prev,
          { host: data.subdomain, ips: data.ips },
        ]);
      }
      if (data.type === "complete") {
        setNumberOfResults(data.count);
        setElapsedTime(data.elapsed_time);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup function: close the WebSocket when the component unmounts
    return () => {
      ws.close();
    };
  }, [url, domain]);

  return {
    progress,
    httpSubdomains,
    dnsSubdomains,
    numberOfResults,
    elapsedTime,
  };
}
