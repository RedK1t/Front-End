import { useSearchParams } from "react-router-dom";
import exportIcon from "../../../assets/ExportIcon.svg";
import SubdomainRow from "./SubdomainRow";

export default function SubdomainsPanel() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("subdomain");
  return (
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-1/2 flex-col gap-y-2.5 rounded-md px-6 py-6">
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

      {/*  Subdomains List */}
      <div className="flex flex-col gap-3 overflow-y-auto py-3">
        {/*  Subdomain Item */}
        <SubdomainRow subdomain="www.targetcorp.com" ip="104.16.123.45" />
        <SubdomainRow subdomain="api.targetcorp.com" ip="104.16.123.46" />
        <SubdomainRow subdomain="admin.targetcorp.com" ip="104.16.123.47" />
        <SubdomainRow subdomain="blog.targetcorp.com" ip="104.16.123.48" />
        <SubdomainRow subdomain="cdn.targetcorp.com" ip="104.16.123.49" />
        <SubdomainRow subdomain="dev.targetcorp.com" ip="104.16.123.50" />
      </div>
    </div>
  );
}
