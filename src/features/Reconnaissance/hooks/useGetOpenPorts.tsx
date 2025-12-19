import { useQuery } from "@tanstack/react-query";
type Port = {
  port: number;
  protocol: "tcp" | "udp" | "sctp";
  state:
    | "open"
    | "closed"
    | "filtered"
    | "unfiltered"
    | "open|filtered"
    | "closed|filtered"
    | "unknown";
  service: string;
  service_version: string;
};
type UpDomain = {
  state: "up";
  ip: string;
  ports: Port[];
};
type DownDomain = {
  state: "down";
  ports: [];
};
type ErrorDomain = {
  state: undefined;
  error: string;
};
type Data = UpDomain | DownDomain | ErrorDomain;
export default function useGetOpenPorts(target: string) {
  const { data, isLoading, error } = useQuery<Data>({
    queryKey: ["openPorts", target],
    queryFn: async () => {
      const response = await fetch(import.meta.env.VITE_openPorts_REST_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domains: [target],
        }),
      });
      return response.json();
    },
  });
  return {
    data,
    isLoading,
    error,
  };
}
