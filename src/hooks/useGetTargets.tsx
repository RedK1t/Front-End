import { getTargets } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export default function useGetTargets() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["targets"],
    queryFn: async () => getTargets(),
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data, isLoading };
}
