import { useSearchParams } from "react-router-dom";
import exportIcon from "../../../assets/ExportIcon.svg";
import SubdomainRow from "./SubdomainRow";
import useSubdomains from "../hooks/useSubdomains";
import { useDomain } from "@/context/DomainContext";
import { motion } from "motion/react";

export default function SubdomainsPanel() {
  const [searchParams] = useSearchParams();
  const { domain } = useDomain();

  const {
    progress,
    dnsSubdomains,
    httpSubdomains,
    numberOfResults,
    elapsedTime,
  } = useSubdomains(domain || "");
  const filter = searchParams.get("subdomain");
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

      <div className="flex h-fit w-full items-center overflow-hidden">
        <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 && filter === "all" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{numberOfResults}</span>
            <p>subdomains in</p>
            <span className="text-red">{elapsedTime}</span>
            <p>seconds</p>
          </div>
        </div>
        <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 && filter === "web" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{httpSubdomains?.length}</span>
            <p>subdomains</p>
          </div>
        </div>
        <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 && filter === "other" ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{dnsSubdomains?.length}</span>
            <p>subdomains</p>
          </div>
        </div>
        <div
          className={`flex h-fit items-center justify-between gap-2 transition-all duration-1000 ease-in-out ${progress === 100 ? "w-0 overflow-hidden opacity-0" : "w-full opacity-100"}`}
        >
          <p className="normal-text text-yellowish-white">Progress:</p>
          <div className="bg-red/40 h-2 w-full rounded-full">
            <div
              className="bg-red h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 20px 1px rgba(250, 1, 12, 0.3)",
              }}
            ></div>
          </div>
          <p className="normal-text text-yellowish-white">
            {+progress.toFixed(0)}%
          </p>
        </div>
      </div>
      {/*  Subdomains List */}
      <motion.div
        key={`${filter || "all"}-${progress === 100}`}
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
        className="flex h-full flex-col gap-3 overflow-x-hidden overflow-y-auto py-3"
      >
        {/*  Subdomain Item */}
        {(filter === "web" || filter === "all") &&
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
        {(filter === "other" || filter === "all") &&
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
