import { useEffect } from "react";
import { useSubdomainContext } from "../../../context/SubdomainContext";
import { useDomain } from "@/context/DomainContext";

export default function useSubdomains() {
  const { domain } = useDomain();
  const { subDomains, startScan } = useSubdomainContext();
  const data = subDomains[domain!] || {
    httpSubdomains: [],
    dnsSubdomains: [],
    progress: 0,
    numberOfResults: 0,
    elapsedTime: 0,
    isScanning: false,
  };

  useEffect(() => {
    // Only start scan if we don't have data, aren't already scanning, and haven't failed
    if (
      domain &&
      !data.isScanning &&
      !data.error &&
      data.progress === 0 &&
      data.numberOfResults === 0
    ) {
      startScan(domain);
    }
  }, [
    domain,
    data.isScanning,
    data.error,
    data.progress,
    data.numberOfResults,
    startScan,
  ]);

  return data;
}
