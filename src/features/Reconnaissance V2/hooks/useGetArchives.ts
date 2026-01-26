import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type ArchiveData = {
  firstScan: string;
  lastScan: string;
  totalScans: number;
  changeCount: number;
  averagePageSize: number;
  scanFrequency: {
    scansPerDay: number;
    daysBetweenScans: number;
  };
  scanUrl: string;
};

function useGetArchives() {
  const { domain } = useDomain();
  const { data, isLoading, error } = useQuery<ArchiveData>({
    queryKey: ["archives", domain],
    queryFn: async () => {
      const res = await fetch(`/web-check-proxy/archives?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetArchives;
