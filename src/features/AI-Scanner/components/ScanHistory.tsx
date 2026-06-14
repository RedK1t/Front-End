import { FaTrash } from "react-icons/fa6";
import useScanHistory from "../hooks/useScanHistory";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ScanHistory() {
  const { scans, isLoading, viewingScanId, loadScan, removeScan } =
    useScanHistory();

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-gray p-6">
      <div>
        <h2 className="mid-text text-white">Scan History</h2>
        <p className="small-text text-dark-yellowish-white mt-1">
          {scans.length > 0
            ? "Saved scans — click one to view its findings."
            : "Completed scans are saved here automatically."}
        </p>
      </div>

      <div className="hide-scrollbar flex max-h-64 flex-col gap-2 overflow-y-auto">
        {isLoading ? (
          <p className="small-text text-dark-yellowish-white">Loading…</p>
        ) : scans.length === 0 ? (
          <p className="small-text text-dark-yellowish-white">
            No saved scans yet. Run a scan and it will appear here when it
            finishes.
          </p>
        ) : (
          scans.map((scan) => {
            const isViewing = scan.id === viewingScanId;
            const total = scan.summary?.total_vulnerabilities ?? 0;
            const sqli = scan.summary?.sqli_vulnerabilities ?? 0;
            const xss = scan.summary?.xss_vulnerabilities ?? 0;
            return (
              <div
                key={scan.id}
                onClick={() => loadScan(scan.id)}
                className={`rounded-xl border p-4 transition-colors cursor-pointer ${
                  isViewing
                    ? "border-red bg-red/10"
                    : "border-white/5 bg-black/30 hover:bg-black/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="normal-text truncate text-white">
                      {scan.domain || scan.target_url || "Unknown target"}
                    </span>
                    <span className="small-text text-dark-yellowish-white mt-0.5">
                      {formatDate(scan.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span
                        className={`small-text ${total > 0 ? "text-red" : "text-green"}`}
                      >
                        {total} finding{total === 1 ? "" : "s"}
                      </span>
                      <span className="text-dark-yellowish-white text-[10px]">
                        SQLi {sqli} · XSS {xss}
                      </span>
                    </div>
                    <button
                      type="button"
                      title="Delete scan"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScan(scan.id);
                      }}
                      className="rounded-6px text-dark-yellowish-white hover:bg-red/20 hover:text-red cursor-pointer p-2 transition-colors"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
