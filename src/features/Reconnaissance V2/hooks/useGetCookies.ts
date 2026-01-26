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
  const { data, isLoading, error } = useQuery<CookiesData>({
    queryKey: ["cookies", domain],
    queryFn: async () => {
      const res = await fetch(`/web-check-proxy/cookies?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetCookies;
