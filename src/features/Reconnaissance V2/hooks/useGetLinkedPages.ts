import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type LinkedPagesData = {
  internal: string[];
  external: string[];
};

function useGetLinkedPages() {
  const { domain } = useDomain();
  const { data, isLoading, error } = useQuery<LinkedPagesData>({
    queryKey: ["linked-pages", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/linked-pages?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetLinkedPages;
