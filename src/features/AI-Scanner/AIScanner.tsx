import { FaBug, FaServer } from "react-icons/fa";
import InfoCard from "./components/InfoCard";
import { IoWarningOutline } from "react-icons/io5";
import ResultsTable from "./components/ResultsTable";
import DetailsCard from "./components/DetailsCard";

export default function AIScanner() {
  return (
    <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 py-5">
      {/* Info Cards */}
      <div className="flex items-center gap-2.5">
        <InfoCard
          title="Endpoints Scanned"
          value="142"
          icon={<FaServer className="text-yellowish-white/10 h-12 w-12" />}
        />
        <InfoCard
          title="Total Payloads"
          value="12,478"
          icon={<FaBug className="text-yellowish-white/10 h-12 w-12" />}
        />
        <InfoCard
          title="Endpoints Scanned"
          value="142"
          icon={
            <IoWarningOutline className="text-yellowish-white/10 h-12 w-12" />
          }
        />
      </div>

      {/* Table */}
      <ResultsTable />
      {/* Req & Res */}
      <DetailsCard />
    </div>
  );
}
