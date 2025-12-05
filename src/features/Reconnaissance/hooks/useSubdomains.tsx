import { useEffect, useState } from "react";

export default function useSubdomains(domain: string) {
  type subdomainData = {
    host: string;
    ips: string[];
  };
  const [subdomains, setSubdomains] = useState<subdomainData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [numberOfResults, setNumberOfResults] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const url = import.meta.env.VITE_subdomains_websocket_url;
  type progressProps = {
    type: "progress";

    percentage: number;
    completed: number;
    total: number;
  };
  type subdomainProps = {
    type: "subdomain";
    host: string;
    ips: string[];
  };
  type completeProps = {
    type: "complete";
    count: number;
    elapsed_time: number;
  };
  type data = progressProps | subdomainProps | completeProps;
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
      if (data.type === "progress") {
        setProgress(data.percentage);
      }
      if (data.type === "subdomain") {
        setSubdomains((prev) => [...prev, { host: data.host, ips: data.ips }]);
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
  }, [url]);

  return { progress, subdomains, numberOfResults, elapsedTime };
}
