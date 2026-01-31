import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";
interface DnsRecords {
  A: string[] | null;
  AAAA: string[] | null;
  AFSDB: string[] | null;
  APL: string[] | null;
  CAA:
    | {
        critical: number;
        issue?: string;
        iodef?: string;
        contactemail?: string;
        contactphone?: string;
      }[]
    | null; // Native CAA returns objects
  CDNSKEY: string[] | null;
  CDS: string[] | null;
  CERT: string[] | null;
  CNAME: string[] | null;
  CSYNC: string[] | null;
  DHCID: string[] | null;
  DLV: string[] | null;
  DNAME: string[] | null;
  DNSKEY: string[] | null;
  DOA: string[] | null;
  DS: string[] | null;
  EUI48: string[] | null;
  EUI64: string[] | null;
  HINFO: string[] | null;
  HIP: string[] | null;
  HTTPS: string[] | null; // DoH returns raw data strings usually
  IPSECKEY: string[] | null;
  KEY: string[] | null;
  KX: string[] | null;
  L32: string[] | null;
  L64: string[] | null;
  LOC: string[] | null;
  LP: string[] | null;
  MX: { exchange: string; priority: number }[] | null; // Native MX
  NAPTR:
    | {
        flags: string;
        service: string;
        regexp: string;
        replacement: string;
        order: number;
        preference: number;
      }[]
    | null; // Native NAPTR
  NID: string[] | null;
  NSEC: string[] | null;
  NSEC3: string[] | null;
  NSEC3PARAM: string[] | null;
  NS: string[] | null;
  OPENPGPKEY: string[] | null;
  PTR: string[] | null;
  RP: string[] | null;
  RRSIG: string[] | null;
  SIG: string[] | null;
  SMIMEA: string[] | null;
  SOA: string[] | null;
  SPF: string[] | null;
  SRV:
    | {
        name: string;
        port: number;
        priority: number;
        weight: number;
        service: string;
      }[]
    | null; // Native SRV + Service Discovery
  SSHFP: string[] | null;
  SVCB: string[] | null;
  TA: string[] | null;
  TKEY: string[] | null;
  TLSA: string[] | null;
  TSIG: string[] | null;
  TXT: string[][] | string[] | null; // Native TXT returns array of arrays (chunks), DoH might be different
  URI: string[] | null;
  ZONEMD: string[] | null;
  ANY: string[] | null;
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

export default function useWhoisDnsRecords() {
  const { domain } = useDomain();
  const { data, error, isFetching, refetch } = useQuery<WhoisDnsRecords>({
    queryKey: ["whois-dns-records", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_DEV_whois
        ? import.meta.env.VITE_DEV_whois
        : import.meta.env.VITE_whois;
      console.log(`${baseUrl}/api/whois/${domain}`)
      const res = await fetch(
        `${baseUrl}/api/whois/${domain}`,
      );
      const data = await res.json();
      return data;
    },
  });
  return { data, error, isFetching, refetch };
}
