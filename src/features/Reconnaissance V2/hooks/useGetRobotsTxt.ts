import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type RobotsTxtData = {
  robots: {
    lbl: string;
    val: string;
  }[];
};

function useGetRobotsTxt() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<RobotsTxtData>({
    queryKey: ["robots-txt", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/robots-txt?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetRobotsTxt;
