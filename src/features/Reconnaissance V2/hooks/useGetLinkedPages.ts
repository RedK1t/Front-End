import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type LinkedPagesData = {
  internal: string[];
  external: string[];
};

function useGetLinkedPages() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<LinkedPagesData>({
    queryKey: ["linked-pages", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_web_check_local_url
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/linked-pages?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetLinkedPages;
