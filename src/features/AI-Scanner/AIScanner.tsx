import ResultsTable from "./components/ResultsTable";
import DetailsCard from "./components/DetailsCard";
import ScannerCacheManager from "./hooks/ScannerCacheManager";
import { useEffect } from "react";
import useScannerActions from "./hooks/useScannerActions";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import InfoCardsList from "./components/InfoCardsList";

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
      <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 overflow-hidden py-5">
        {/* Header actions */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/AiReport")}
            className="small-text rounded-6px bg-red hover:bg-light-red cursor-pointer px-4 py-2 text-white transition-colors"
          >
            Generate Report
          </button>
        </div>
        {/* Info Cards */}
        <InfoCardsList />
        {/* Table */}
        <ResultsTable />
        {/* Req & Res */}
        <DetailsCard />
      </div>
    </>
  );
}
