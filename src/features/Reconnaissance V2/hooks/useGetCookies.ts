import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type ClientCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  size: number;
  httpOnly: boolean;
  secure: boolean;
  session: boolean;
  sameSite: string;
  priority: string;
  sameParty: boolean;
  sourceScheme: string;
};
type CookiesData = {
  headerCookies: string[] | null;
  clientCookies: ClientCookie[] | null;
};

function useGetCookies() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<CookiesData>({
    queryKey: ["cookies", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/cookies?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetCookies;
