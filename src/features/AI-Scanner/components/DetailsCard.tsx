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
    <div className="bg-gray rounded-6px flex h-125 flex-col gap-3 overflow-hidden p-3">
      <div className="flex h-full w-full items-center gap-3 overflow-hidden">
        <div className="rounded-6px h-full w-1/2 overflow-hidden bg-black px-3">
          <ReqResContent
            requestAndResponse={false}
            type="Request"
            text={request}
            editableProp={false}
          />
        </div>
        <div className="rounded-6px h-full w-1/2 overflow-hidden bg-black px-3">
          <ReqResContent
            requestAndResponse={false}
            type="Response"
            text={response}
            editableProp={false}
          />
        </div>
      </div>
      <div className="rounded-6px flex w-full flex-col gap-1 bg-black p-3">
        <p className="text-yellowish-white mid-text">Explanation</p>
        <p className="text-dark-yellowish-white normal-text">{explanation}</p>
      </div>
    </div>
  );
}
