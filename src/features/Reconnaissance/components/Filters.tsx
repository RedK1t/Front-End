import { useSearchParams } from "react-router-dom";
import FilterTab from "./FilterTab";
import { useEffect } from "react";

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Set default filters if not present
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!searchParams.has("dig")) newParams.set("dig", "whois");
    if (!searchParams.has("subdomain")) newParams.set("subdomain", "all");
    if (!searchParams.has("dig") || !searchParams.has("subdomain")) {
      setSearchParams(newParams, { replace: true });
    }
  }, []);
  return (
    <div className="mx-auto flex w-11/12 items-center justify-between pt-11">
      {/* Dig Filter */}
      <div className="bg-gray text-yellowish-white flex items-center gap-1 rounded-2xl px-2 py-1">
        <FilterTab paramName="dig" paramData="whois">
          WHOIS
        </FilterTab>
        <FilterTab paramName="dig" paramData="dns">
          DNS Records
        </FilterTab>
        <FilterTab paramName="dig" paramData="ssl">
          SSL/TLS
        </FilterTab>
        <FilterTab paramName="dig" paramData="info">
          INFO
        </FilterTab>
      </div>

      {/* Subdomain Filter */}
      <div className="bg-gray text-yellowish-white flex items-center gap-1 rounded-2xl px-2 py-1">
        <FilterTab paramName="subdomain" paramData="all">
          All
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="active">
          Active
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="inactive">
          Inactive
        </FilterTab>
      </div>
    </div>
  );
}
