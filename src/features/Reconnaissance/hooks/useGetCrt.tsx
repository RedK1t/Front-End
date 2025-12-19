import { useQuery } from "@tanstack/react-query";
type CrtData = {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  result_count: number;
}[];
export default function useGetCrt(domain: string) {
  const { data, isLoading, error } = useQuery<CrtData>({
    queryKey: ["crt", domain],
    queryFn: async () => {
      const res = await fetch(`https://crt.sh/json?q=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}
