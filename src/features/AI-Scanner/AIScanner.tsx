import ResultsTable from "./components/ResultsTable";
import DetailsCard from "./components/DetailsCard";
import ScanHistory from "./components/ScanHistory";
import ScannerCacheManager from "./hooks/ScannerCacheManager";
import { useEffect, useRef } from "react";
import { ReadyState } from "react-use-websocket";
import toast from "react-hot-toast";
import useScannerActions from "./hooks/useScannerActions";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import InfoCardsList from "./components/InfoCardsList";
import { FaFileAlt } from "react-icons/fa";
import useProxyTraffic from "../Interceptor/hooks/useProxyTraffic";

type QuickScanState = { rawRequest?: string; url?: string } | null;

export default function AIScanner() {
  const { startScan, startRawScan, readyState } = useScannerActions();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuickScanState;
  const url = searchParams.get("url");
  const selectedId = searchParams.get("selected");
  const { interceptedRequests, history } = useProxyTraffic();

  // Snapshot the scan target on the FIRST render and never let it change.
  // The results table below renders the shared <Table/>, whose mount effect calls
  // setSearchParams(..., { replace: true }) on a setTimeout(0) — that wipes BOTH the
  // ?url= param AND location.state moments after this page mounts, well before the
  // (wss) WebSocket finishes opening. Reading the live `state`/`url` from inside the
  // trigger effect would therefore see nulls and never start the scan. Capturing them
  // synchronously here, before that timeout fires, makes the launch immune to the wipe.
  const targetRef = useRef<{ rawRequest?: string; url?: string } | null>(null);
  if (targetRef.current === null) {
    let target: { rawRequest?: string; url?: string } = {
      rawRequest: state?.rawRequest,
      url: state?.url ?? url ?? undefined,
    };
    // Belt-and-braces: if the state/url were already gone on this first render,
    // recover the target from the still-selected request id — the captured request
    // lives in the React Query cache (staleTime: Infinity) and survives the wipe.
    if (!target.rawRequest && !target.url && selectedId) {
      const req = interceptedRequests.find((r) => r.id === selectedId);
      const hist = history.find((h) => h.id === selectedId);
      if (req?.raw) target = { rawRequest: req.raw, url: req.url };
      else if (req?.url) target = { url: req.url };
      else if (hist?.URL) target = { url: hist.URL };
    }
    targetRef.current = target;
  }

  // Fire the scan exactly once, and only once the WebSocket is actually OPEN — sending
  // before the (wss) handshake completes can drop the message (the page would then sit
  // at 0/0/0 with no scan ever starting on the server).
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    if (readyState !== ReadyState.OPEN) return;
    const target = targetRef.current;
    // Prefer a full raw request (tests body params); fall back to URL-only scans.
    if (target?.rawRequest) {
      startedRef.current = true;
      startRawScan({ rawRequest: target.rawRequest, url: target.url });
      toast.loading("Starting scan…", { id: "scan-start", duration: 2500 });
    } else if (target?.url) {
      startedRef.current = true;
      startScan(target.url);
      toast.loading("Starting scan…", { id: "scan-start", duration: 2500 });
    }
  }, [readyState, startScan, startRawScan]);
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
