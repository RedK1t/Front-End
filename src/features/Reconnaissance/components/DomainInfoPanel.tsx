import { useSearchParams } from "react-router-dom";
import copyIcon from "../../../assets/copyIcon.svg";
import exportIcon from "../../../assets/ExportIcon.svg";
import InfoRow from "./InfoRow";

export default function DomainInfoPanel() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("dig");
  return (
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-full flex-col gap-y-10 rounded-md px-6 py-6 lg:w-1/2">
      {/*  Header */}
      <div className="flex w-full items-center justify-between">
        <p className="large-text text-white">{filter} information</p>

        {/*  Header Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={copyIcon} alt="copy icon" />
            Copy
          </button>
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={exportIcon} alt="export icon" />
            Export
          </button>
        </div>
      </div>

      {/*  Domain Info */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        <InfoRow label="Domain Name" value="Example.com" />
        <InfoRow label="Registrar" value="GoDaddy, LLC" />
        <InfoRow label="Creation Date" value="2005-03-15" />
        <InfoRow label="Expiration Date" value="2026-03-15" />
        <InfoRow label="Last Updated" value="2023-11-02" />
        <InfoRow
          label="Name Servers"
          value="ns1.example.com, ns2.example.com"
        />
      </div>
    </div>
  );
}
