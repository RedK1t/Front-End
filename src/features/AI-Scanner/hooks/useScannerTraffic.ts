import { useQuery } from "@tanstack/react-query";

import type { vulnerabilities } from "../types";

function useScannerTraffic() {
  const { data: vulnerabilities } = useQuery<vulnerabilities>({
    queryKey: ["vulnerabilities"],
    queryFn: () => [], // Dummy function
    enabled: true,
    initialData: [],
    staleTime: Infinity,
  });
  const { data: totalPayloads } = useQuery<number>({
    queryKey: ["total-payloads"],
    queryFn: () => 0, // Dummy function
    enabled: true,
    initialData: 0,
    staleTime: Infinity,
  });
  const { data: endpointsScanned } = useQuery<number>({
    queryKey: ["endpoints-scanned"],
    queryFn: () => 0, // Dummy function
    enabled: true,
    initialData: 0,
    staleTime: Infinity,
  });
  return {
    vulnerabilities,
    totalPayloads,
    endpointsScanned,
  };
}

export default useScannerTraffic;
