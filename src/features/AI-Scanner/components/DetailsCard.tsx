import ReqResContent from "@/features/reqResPanel/components/ReqResContent";
import useScannerTraffic from "../hooks/useScannerTraffic";
import { useSearchParams } from "react-router-dom";

export default function DetailsCard() {
  const { vulnerabilities } = useScannerTraffic();
  const [searchParams] = useSearchParams();
  const selectedIndex = searchParams.get("selected") || 0;
  const request = vulnerabilities[Number(selectedIndex)]?.raw_request || "";
  const response = vulnerabilities[Number(selectedIndex)]?.raw_response || "";
  const explanation = vulnerabilities[Number(selectedIndex)]?.explanation || "";
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-gray p-6">
      <div>
        <h2 className="mid-text text-white">Request & Response</h2>
        <p className="small-text text-dark-yellowish-white mt-1">
          Raw details for the selected vulnerability
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-80 overflow-hidden rounded-xl border border-white/5 bg-black/50 p-4">
          <ReqResContent
            requestAndResponse={false}
            type="Request"
            text={request}
            editableProp={false}
          />
        </div>
        <div className="h-80 overflow-hidden rounded-xl border border-white/5 bg-black/50 p-4">
          <ReqResContent
            requestAndResponse={false}
            type="Response"
            text={response}
            editableProp={false}
          />
        </div>
      </div>
      <div className="rounded-xl border border-white/5 bg-black/50 p-5">
        <h3 className="mid-text text-yellowish-white mb-2">Explanation</h3>
        <p className="text-dark-yellowish-white normal-text leading-relaxed">{explanation || "Select a vulnerability from the table above to view its explanation."}</p>
      </div>
    </div>
  );
}
