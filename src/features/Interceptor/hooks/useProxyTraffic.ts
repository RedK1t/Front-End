import { useQuery } from "@tanstack/react-query";
import type { intercepted_request, intercepted_response } from "../types";

function useProxyTraffic() {
  const { data: interceptStatus = false } = useQuery<boolean>({
    queryKey: ["intercept_status"],
    queryFn: () => false, // Dummy function
    enabled: true,
    initialData: false,
    staleTime: Infinity,
  });
  const { data: markedForResponseIntercept = [] } = useQuery<string[]>({
    queryKey: ["marked-for-response-intercept"],
    queryFn: () => [], // Dummy function
    enabled: true,
    initialData: [],
    staleTime: Infinity,
  });
  const { data: interceptedRequests = [] } = useQuery<intercepted_request[]>({
    queryKey: ["intercepted_request"],
    queryFn: () => [], // Dummy function
    enabled: true,
    initialData: [],
    staleTime: Infinity,
  });
  const { data: interceptedResponses = [] } = useQuery<intercepted_response[]>({
    queryKey: ["intercepted_response"],
    queryFn: () => [], // Dummy function
    enabled: true,
    initialData: [],
    staleTime: Infinity,
  });

  return {
    markedForResponseIntercept,
    interceptedRequests,
    interceptedResponses,
    interceptStatus,
  };
}

export default useProxyTraffic;
