import { getUser } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export default function useGetUser() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getUser(),
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data, isLoading };
}
