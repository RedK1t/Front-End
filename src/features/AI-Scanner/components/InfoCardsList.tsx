import InfoCard from "./InfoCard";
import { FaBug, FaServer } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import useScannerTraffic from "../hooks/useScannerTraffic";

export default function InfoCardsList() {
  const { vulnerabilities, totalPayloads, endpointsScanned } =
    useScannerTraffic();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <InfoCard
        title="Endpoints Scanned"
        value={endpointsScanned || 0}
        icon={<FaServer className="h-6 w-6" />}
        colorVariant="blue"
      />
      <InfoCard
        title="Total Payloads"
        value={totalPayloads || 0}
        icon={<FaBug className="h-6 w-6" />}
        colorVariant="orange"
      />
      <InfoCard
        title="Vulnerabilities Found"
        value={vulnerabilities?.length || 0}
        icon={<IoWarningOutline className="h-6 w-6" />}
        colorVariant="red"
      />
    </div>
  );
}
