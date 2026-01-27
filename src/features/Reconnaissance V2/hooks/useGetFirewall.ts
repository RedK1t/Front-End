import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type FirewallData = {
  hasWaf: boolean;
  waf?: string;
};

function useGetFirewall() {
  const { domain } = useDomain();
  const { data, isLoading, error } = useQuery<FirewallData>({
    queryKey: ["firewall", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/firewall?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetFirewall;
