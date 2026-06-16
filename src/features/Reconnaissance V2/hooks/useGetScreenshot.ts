import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type ScreenshotData = {
  image?: string;
  error?: string;
  skipped?: string;
};

function useGetScreenshot() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<ScreenshotData>({
    queryKey: ["screenshot", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_web_check_local_url
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/screenshot?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetScreenshot;
