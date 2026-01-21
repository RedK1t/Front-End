import useSubdomains from "@/features/Reconnaissance/hooks/useSubdomains";
import Panel from "./Panel";
import SubdomainRow from "./SubdomainRow";

export default function SubDomainsPanel() {
  const {
    progress,
    dnsSubdomains,
    httpSubdomains,
    numberOfResults,
    elapsedTime,
  } = useSubdomains();
  return (
    <Panel
      title="SubDomains"
      filter="subdomainsStatus"
      options={["All", "Active", "Inactive"]}
    >
      <div className="flex h-fit w-full items-center overflow-hidden">
        <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{numberOfResults}</span>
            <p>subdomains in</p>
            <span className="text-red">{elapsedTime}</span>
            <p>seconds</p>
          </div>
        </div>
        {/* <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{httpSubdomains?.length}</span>
            <p>subdomains</p>
          </div>
        </div> */}
        {/* <div
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress === 100 ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>Found</p>
            <span className="text-red">{dnsSubdomains?.length}</span>
            <p>subdomains</p>
          </div>
        </div> */}
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
      {progress === 100 &&
        dnsSubdomains.map((subdomain) => (
          <SubdomainRow data={subdomain} key={subdomain.subdomain} />
        )) &&
        httpSubdomains.map((subdomain) => (
          <SubdomainRow data={subdomain} key={subdomain.subdomain} />
        ))}
    </Panel>
  );
}
