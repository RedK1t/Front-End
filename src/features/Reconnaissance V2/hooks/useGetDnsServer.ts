import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type DnsServer = {
  address: string;
  hostname: string[];
  dohDirectSupports: boolean;
};

type DnsServerData = {
  domain: string;
  dns: DnsServer[];
};

function useGetDnsServer() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<DnsServerData>({
    queryKey: ["dns-server", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/dns-server?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetDnsServer;
