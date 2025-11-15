import FilterTab from "./FilterTab";

export default function Filters() {
  return (
    <div className="mx-auto flex w-10/12 items-center justify-between pt-11">
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
      <div className="bg-gray text-yellowish-white flex items-center gap-1 rounded-2xl px-2 py-1">
        <FilterTab paramName="subdomain" paramData="whois">
          All
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="dns">
          Active
        </FilterTab>
        <FilterTab paramName="subdomain" paramData="ssl">
          Inactive
        </FilterTab>
      </div>
    </div>
  );
}
