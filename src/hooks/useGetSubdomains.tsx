import { getSubdomains } from "@/api/supabase";
import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

export default function useGetSubdomains() {
  const { domain } = useDomain();
  const { data, error, isLoading } = useQuery({
    queryKey: ["subdomains", domain],
    queryFn: () => getSubdomains(domain!),
  });
  return { data, error, isLoading };
}
