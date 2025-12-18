import { useQuery } from "@tanstack/react-query";

interface MxRecord {
  exchange: string;
  priority: number;
}
interface DnsRecords {
  A: string[];
  AAAA: string[];
  MX: MxRecord[];
  NS: string[];
  TXT: string[][];
}
type DNSInfo = {
  domain: string;
  records: DnsRecords;
};
type SuccessRespond = {
  success: true;

  dns: DNSInfo | null;
  whois: any | null;
  domain: string;
  timestamp: string;
};
type ErrorRespond = {
  success: false;

  error: string;
  message: string;
};

type WhoisDnsRecords = SuccessRespond | ErrorRespond;

export default function useWhoisDnsRecords(domain: string) {
  const { data, error, isLoading } = useQuery<WhoisDnsRecords>({
    queryKey: ["whois-dns-records", domain],
    queryFn: async () => {
      const res = await fetch(
        `https://whois-eta.vercel.app/api/whois/${domain}`,
      );
      const data = await res.json();
      return data;
    },
  });
  return { data, error, isLoading };
}
