import InfoCard from "./InfoCard";
import { FaBug, FaServer } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import useScannerTraffic from "../hooks/useScannerTraffic";

export default function InfoCardsList() {
  const { vulnerabilities, totalPayloads, endpointsScanned } =
    useScannerTraffic();
  return (
    <div className="flex items-center gap-2.5">
      <InfoCard
        title="Endpoints Scanned"
        value={endpointsScanned || 0}
        icon={<FaServer className="text-yellowish-white/10 h-12 w-12" />}
      />
      <InfoCard
        title="Total Payloads"
        value={totalPayloads || 0}
        icon={<FaBug className="text-yellowish-white/10 h-12 w-12" />}
      />
      <InfoCard
        title="Vulnerabilities Found"
        value={vulnerabilities?.length || 0}
        icon={
          <IoWarningOutline className="text-yellowish-white/10 h-12 w-12" />
        }
      />
    </div>
  );
}
