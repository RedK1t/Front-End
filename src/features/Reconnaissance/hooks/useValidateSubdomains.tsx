import type { subdomainData } from "@/types/types";
import { useEffect, useRef, useState } from "react";

type ActiveHttp = {
  status: number;
  subdomain: string;
  url: string;
  ips: string[];
};
type dns_only = {
  subdomain: string;
  ips: string[];
};
type ValidateSubdomainsResponse = {
  alive_dns: number;
  dns_only: dns_only[];
  dns_only_count: number;
  live_web_services: ActiveHttp[];
  live_web_services_count: number;
  total_subdomains: number;
};
export default function useValidateSubdomains({
  subdomains,
  progress,
}: {
  subdomains: subdomainData[];
  progress: number;
}) {
  const [ActiveHttp, setActiveHttp] = useState<ActiveHttp[]>();
  const [dnsOnly, setDnsOnly] = useState<dns_only[]>();
  const loading = useRef(false);
  useEffect(() => {
    loading.current = true;
    if (progress !== 100) return;
    async function validateSubdomains() {
      const subdomainsToCheck = subdomains.map((subdomain) => subdomain.host);

      const response = await fetch("http://localhost:9000/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subs: subdomainsToCheck,
        }),
      });
      const data: ValidateSubdomainsResponse = await response.json();
      setActiveHttp(data.live_web_services);
      setDnsOnly(data.dns_only);
      console.log(data);
    }
    validateSubdomains();
    loading.current = false;
  }, [progress, subdomains]);
  return {
    ActiveHttp,
    dnsOnly,
    loading,
  };
}
