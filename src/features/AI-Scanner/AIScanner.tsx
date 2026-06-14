import ResultsTable from "./components/ResultsTable";
import DetailsCard from "./components/DetailsCard";
import ScanHistory from "./components/ScanHistory";
import ScannerCacheManager from "./hooks/ScannerCacheManager";
import { useEffect } from "react";
import useScannerActions from "./hooks/useScannerActions";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import InfoCardsList from "./components/InfoCardsList";
import { FaFileAlt } from "react-icons/fa";

type QuickScanState = { rawRequest?: string; url?: string } | null;

export default function AIScanner() {
  const { startScan, startRawScan } = useScannerActions();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuickScanState;
  const url = searchParams.get("url");
  useEffect(() => {
    // Prefer a full raw request (tests body params); fall back to URL-only scans.
    if (state?.rawRequest) {
      startRawScan({ rawRequest: state.rawRequest, url: state.url });
    } else if (url) {
      startScan(url);
    }
  }, []);
  return (
    <>
      <ScannerCacheManager />
      <div className="mx-auto flex h-full w-11/12 flex-col gap-6 overflow-hidden py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading-text text-white">AI Vulnerability Scanner</h1>
            <p className="small-text text-dark-yellowish-white mt-1">
              Automated security testing for your endpoints
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/AiReport")}
            className="flex items-center gap-2 rounded-xl bg-red px-6 py-3 text-white transition-all hover:bg-light-red hover:shadow-lg hover:shadow-red/20"
          >
            <FaFileAlt className="h-4 w-4" />
            <span className="small-text font-medium">Generate Report</span>
          </button>
        </div>

        {/* Info Cards */}
        <InfoCardsList />

        {/* Saved scans */}
        <ScanHistory />

        {/* Table */}
        <ResultsTable />

        {/* Req & Res */}
        <DetailsCard />
      </div>
    </>
  );
}
