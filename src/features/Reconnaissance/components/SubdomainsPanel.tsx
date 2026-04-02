import { useSearchParams } from "react-router-dom";
import exportIcon from "../../../assets/ExportIcon.svg";
import SubdomainRow from "./SubdomainRow";
import useSubdomains from "../hooks/useSubdomains";
import { motion } from "motion/react";
import { insertSubdomains } from "@/api/supabase";
import { useDomain } from "@/context/DomainContext";
import { useEffect } from "react";
import useGetSubdomains from "@/hooks/useGetSubdomains";
import Loader from "@/components/Loader";

export default function SubdomainsPanel() {
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
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-full flex-col gap-y-2.5 rounded-md px-6 py-6 lg:w-1/2">
      {/*  Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="large-text text-white">Discovered Subdomains</p>
        </div>

        {/*  Header Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={exportIcon} alt="export icon" />
            Export
          </button>
        </div>
      </div>

      {/*  Subdomains Count */}
      <div className="flex h-fit w-full items-center overflow-hidden">
        <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${(progress === 100 || (data && data.length > 0)) && filter === "all" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{numberOfResults || data?.length}</span>
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

      {/*  Subdomains List */}
      <motion.div
        key={`${filter || "all"}-${numberOfResults}-${isLoading}`}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className={`flex h-full flex-col gap-3 overflow-x-hidden overflow-y-auto py-3 ${isLoading || isScanning ? "hide-scrollbar" : ""}`}
      >
        {/*  Subdomain Item */}
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
              <motion.div
                layout
                key={subdomain.name}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <SubdomainRow
                  subdomain={subdomain.name}
                  ip={subdomain.ips.join(", ")}
                  status={subdomain.status_code}
                  url={subdomain.url}
                />
              </motion.div>
            ))}

        {!isScanning &&
          (filter === "web" || filter === "all") &&
          httpSubdomains?.length > 0 &&
          httpSubdomains?.map((subdomain) => (
            <motion.div
              layout
              key={subdomain.subdomain}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <SubdomainRow
                subdomain={subdomain.subdomain}
                ip={subdomain.ips.join(", ")}
                status={subdomain.status}
                url={subdomain.url}
              />
            </motion.div>
          ))}

        {!isScanning &&
          (filter === "other" || filter === "all") &&
          dnsSubdomains?.length > 0 &&
          dnsSubdomains?.map((subdomain) => (
            <motion.div
              layout
              key={subdomain.subdomain}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <SubdomainRow
                subdomain={subdomain.subdomain}
                ip={subdomain.ips.join(", ")}
              />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}
