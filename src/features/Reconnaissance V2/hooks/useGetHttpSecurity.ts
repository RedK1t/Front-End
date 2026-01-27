import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type HttpSecurityData = {
  strictTransportPolicy: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  xXSSProtection: boolean;
  contentSecurityPolicy: boolean;
};

function useGetHttpSecurity() {
  const { domain } = useDomain();
  const { data, isLoading, error } = useQuery<HttpSecurityData>({
    queryKey: ["http-security", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/http-security?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetHttpSecurity;
