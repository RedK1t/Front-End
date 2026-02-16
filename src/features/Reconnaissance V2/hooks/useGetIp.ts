import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type IpData = {
  ip: string;
  family: number;
};

function useGetIp() {
  const { domain } = useDomain();
  const { data, isFetching, error } = useQuery<IpData>({
    queryKey: ["ip", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_web_check_local_url
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/get-ip?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error };
}

export default useGetIp;
