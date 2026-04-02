import { getPorts, insertPorts } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
type Port = {
  port: number;
  protocol: string;
  state: string;
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
export default function useGetOpenPorts(target: string, enabled: boolean) {
  const { data, isLoading, error } = useQuery<Data>({
    queryKey: ["openPorts", target],
    enabled: enabled && !!target,
    queryFn: async () => {
      const ports = await getPorts(target);
      if (ports.length > 0) return { state: "up", ip: "000", ports };
      const response = await fetch(import.meta.env.VITE_openPorts_REST_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domains: [target],
        }),
      });
      const data: Data = await response.json();
      if (data.state === "up") {
        const dataToInsert = data.ports.map((port) => ({
          ...port,
          sub_domain_name: target,
        }));
        await insertPorts(dataToInsert);
      }
      return data;
    },
  });
  return {
    data,
    isLoading,
    error,
  };
}
