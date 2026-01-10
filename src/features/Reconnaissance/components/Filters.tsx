import FilterTab from "./FilterTab";

export default function Filters() {
  return (
    <div className="mx-auto flex w-11/12 items-center justify-between pt-11">
      {/* Dig Filter */}
      <div className="bg-gray text-yellowish-white flex items-center gap-1 rounded-md px-2 py-1">
        <FilterTab paramName="dig" paramData="Whois" isDefault>
          WHOIS
        </FilterTab>
        <FilterTab paramName="dig" paramData="Dns">
          DNS Records
        </FilterTab>
        <FilterTab paramName="dig" paramData="Ssl">
          SSL/TLS
        </FilterTab>
        <FilterTab paramName="dig" paramData="Info">
          INFO
        </FilterTab>
      </div>

      {/* Subdomain Filter */}
      <div className="bg-gray text-yellowish-white flex items-center gap-1 rounded-md px-2 py-1">
        <FilterTab paramName="subdomain" paramData="all" isDefault>
          All
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="web">
          Web
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="other">
          Other
        </FilterTab>
      </div>
    </div>
  );
}
