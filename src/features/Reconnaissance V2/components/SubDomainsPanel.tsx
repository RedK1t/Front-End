import useSubdomains from "@/features/Reconnaissance/hooks/useSubdomains";
import Panel from "./Panel";
import SubDomainRow from "./SubDomainDataRow";
import useGetSubdomains from "@/hooks/useGetSubdomains";
import { useSearchParams } from "react-router-dom";
import { useDomain } from "@/context/DomainContext";
import { insertSubdomains } from "@/api/supabase";
import { useEffect } from "react";
import Loader from "@/components/Loader";

export default function SubDomainsPanel() {
  const [searchParams] = useSearchParams();
  const { domain } = useDomain();
  const { data, isLoading } = useGetSubdomains();

  const {
    progress,
    dnsSubdomains,
    httpSubdomains,
    numberOfResults,
    isScanning,
  } = useSubdomains(!isLoading && data?.length === 0);

  useEffect(() => {
    if (!isScanning && progress === 100) {
      const subdomainsToInsert = dnsSubdomains
        .map((item) => {
          return {
            name: item.subdomain,
            ips: item.ips,
            target_domain: domain || "",
          };
        })
        .concat(
          httpSubdomains.map((item) => ({
            name: item.subdomain,
            ips: item.ips,
            target_domain: domain || "",
            status_code: item.status,
            url: item.url,
          })),
        );
      try {
        insertSubdomains(subdomainsToInsert);
      } catch (error) {
        console.error("Error inserting subdomains:", error);
      }
    }
  }, [dnsSubdomains, httpSubdomains, domain, progress, isScanning]);

  const filter = searchParams.get("subdomain") || "all";

  return (
    <Panel
      title="SubDomains"
      filter="subdomain"
      options={["all", "web", "other"]}
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center overflow-hidden">
          <div
            className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${(progress === 100 || (data && data.length > 0)) && filter === "all" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
          >
            <div className="normal-text text-yellowish-white flex items-center gap-1">
              <p>Found</p>
              <span className="text-red">
                {numberOfResults || data?.length}
              </span>
              <p>subdomains</p>
            </div>
          </div>

          <div
            className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${(progress === 100 || !isLoading) && filter === "web" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
          >
            <div className="normal-text text-yellowish-white flex items-center gap-1">
              <p>Found</p>
              <span className="text-red">
                {httpSubdomains?.length ||
                  data?.filter((item) => item.status_code !== null)?.length}
              </span>
              <p>subdomains</p>
            </div>
          </div>

          <div
            className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${(progress === 100 || !isLoading) && filter === "other" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
          >
            <div className="normal-text text-yellowish-white flex items-center gap-1">
              <p>Found</p>
              <span className="text-red">
                {dnsSubdomains?.length ||
                  data?.filter((item) => item.status_code === null)?.length}
              </span>
              <p>subdomains</p>
            </div>
          </div>
        </div>

        {(isLoading || isScanning) && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        )}

        {!isLoading &&
          data &&
          data
            ?.filter((subdomain) => {
              if (filter === "web" || filter === "all") {
                return subdomain.status_code !== null;
              }
              if (filter === "other" || filter === "all") {
                return subdomain.status_code === null;
              }
              return true;
            })
            .map((subdomain) => (
              <SubDomainRow
                data={{
                  subdomain: subdomain.name,
                  ips: subdomain.ips,
                  status: subdomain.status_code,
                  url: subdomain.url,
                }}
              />
            ))}

        {!isScanning &&
          (filter === "web" || filter === "all") &&
          httpSubdomains?.length > 0 &&
          httpSubdomains?.map((subdomain) => (
            <SubDomainRow
              data={{
                subdomain: subdomain.subdomain,
                ips: subdomain.ips,
                status: subdomain.status,
                url: subdomain.url,
              }}
            />
          ))}

        {!isScanning &&
          (filter === "other" || filter === "all") &&
          dnsSubdomains?.length > 0 &&
          dnsSubdomains?.map((subdomain) => (
            <SubDomainRow
              data={{
                subdomain: subdomain.subdomain,
                ips: subdomain.ips,
              }}
            />
          ))}
      </div>
    </Panel>
  );
}
