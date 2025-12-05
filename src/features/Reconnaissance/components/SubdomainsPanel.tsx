import { useSearchParams } from "react-router-dom";
import exportIcon from "../../../assets/ExportIcon.svg";
import SubdomainRow from "./SubdomainRow";
import useSubdomains from "../hooks/useSubdomains";

export default function SubdomainsPanel() {
  const [searchParams] = useSearchParams();
  const { progress, subdomains, numberOfResults, elapsedTime } =
    useSubdomains("facebook.com");
  const filter = searchParams.get("subdomain");
  return (
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-full flex-col gap-y-2.5 rounded-md px-6 py-6 lg:w-1/2">
      {/*  Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="large-text text-white">Discovered Subdomains</p>
          <p className="normal-text text-yellowish-white">
            {filter === "all"
              ? "X subdomains (X Active)"
              : filter === "active"
                ? "X active subdomains"
                : "X inactive subdomains"}
          </p>
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
          className={`flex flex-nowrap items-center justify-between gap-2 text-nowrap transition-all duration-1000 ease-in-out ${progress !== 100 ? "w-0 overflow-hidden opacity-0" : "w-full opacity-100"}`}
        >
          <div className="normal-text text-yellowish-white flex items-center gap-1">
            <p>found</p>
            <span className="text-red">{numberOfResults}</span>
            <p>subdomains in</p>
            <span className="text-red">{elapsedTime}</span>
            <p>seconds</p>
          </div>
        </div>
        <div
          className={`flex h-fit items-center justify-between gap-2 transition-all duration-1000 ease-in-out ${progress === 100 ? "w-0 overflow-hidden opacity-0" : "w-full opacity-100"}`}
        >
          <p className="normal-text text-yellowish-white">progress:</p>
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
      <div className="flex h-full flex-col gap-3 overflow-y-auto py-3">
        {/*  Subdomain Item */}
        {subdomains.map((subdomain) => (
          <SubdomainRow
            key={subdomain.host}
            subdomain={subdomain.host}
            ip={subdomain.ips.join(", ")}
          />
        ))}
      </div>
    </div>
  );
}
