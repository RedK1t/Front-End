import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type SslCertData = {
  subject: {
    C: string;
    ST: string;
    L: string;
    O: string;
    CN: string;
  };
  issuer: {
    C: string;
    O: string;
    CN: string;
  };
  infoAccess: {
    "OCSP - URI": string[];
    "CA Issuers - URI": string[];
  };
  ca: boolean;
  modulus: string;
  bits: number;
  exponent: string;
  pubkey: {
    type: string;
    data: number[];
  };
  valid_from: string;
  valid_to: string;
  fingerprint: string;
  fingerprint256: string;
  fingerprint512: string;
  ext_key_usage: string[];
  serialNumber: string;

  asn1Curve: string;
  nistCurve: string;
};

function useGetSslCert() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<SslCertData>({
    queryKey: ["ssl-cert", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_web_check_local_url
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/ssl?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetSslCert;
