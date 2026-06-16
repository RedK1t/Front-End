import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFileWord, FaFilePdf, FaMarkdown } from "react-icons/fa";
import useGenerateReport from "./hooks/useGenerateReport";
import useScanHistory from "@/features/AI-Scanner/hooks/useScanHistory";
import { useDomain } from "@/context/DomainContext";
import { getScan } from "@/api/supabase";

// The report API returns download paths relative to its own origin (e.g.
// "/api/report/download?format=docx"). Resolve them against the configured base.
const REPORT_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_generateReport_REST_url).origin;
  } catch {
    return "";
  }
})();

function downloadHref(path: string | null): string | undefined {
  if (!path) return undefined;
  return REPORT_ORIGIN ? `${REPORT_ORIGIN}${path}` : path;
}

export default function AiReport() {
  const { domain } = useDomain();
  // Scans already scoped to the current user (Supabase user_id) AND the current
  // target (domain filter). Newest first → [0] is this target's latest scan.
  const { scans, isLoading: historyLoading } = useScanHistory();
  const latest = scans[0] ?? null;

  // Full record (with findings) for that latest scan.
  const { data: fullScan, isLoading: scanLoading } = useQuery({
    queryKey: ["scan", latest?.id],
    queryFn: () => getScan(latest!.id),
    enabled: !!latest,
  });

  const { generateReport, data, isError, isPending, reset } =
    useGenerateReport();

  // Build the report from THIS target's latest scan only. Re-runs when the
  // target (or its latest scan) changes; clears when the target has no scan
  // (e.g. it was just deleted) so a stale report is never shown.
  useEffect(() => {
    if (fullScan) {
      generateReport({
        target_url: fullScan.target_url ?? domain ?? "Unknown",
        vulnerabilities: fullScan.vulnerabilities ?? [],
      });
    } else if (!latest) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullScan?.id, latest]);

  const loadingScan = historyLoading || (!!latest && scanLoading);
  const noScanForTarget = !loadingScan && !latest;

  const docx = downloadHref(data?.downloads.docx ?? null);
  const pdf = downloadHref(data?.downloads.pdf ?? null);
  const md = downloadHref(data?.downloads.md ?? null);

  return (
    <div className="mx-auto flex h-full w-11/12 flex-col gap-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="heading-text text-light-red">Vulnerability Report</h1>
          <p className="normal-text text-dark-yellowish-white">
            {noScanForTarget
              ? domain
                ? `No scan found for ${domain}.`
                : "No target selected."
              : `Generated from this target's latest scan${
                  data?.target_url ? ` — ${data.target_url}` : ""
                }.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              fullScan &&
              generateReport({
                target_url: fullScan.target_url ?? domain ?? "Unknown",
                vulnerabilities: fullScan.vulnerabilities ?? [],
              })
            }
            disabled={isPending || !fullScan}
            className={`small-text rounded-6px px-4 py-2 transition-colors ${
              isPending || !fullScan
                ? "bg-red/40 text-dark-yellowish-white/60 cursor-not-allowed"
                : "bg-red hover:bg-light-red cursor-pointer text-white"
            }`}
          >
            {isPending ? "Generating…" : "Regenerate"}
          </button>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <DownloadButton
          href={docx}
          label="Download DOCX"
          icon={<FaFileWord className="h-4 w-4" />}
        />
        <DownloadButton
          href={pdf}
          label="Download PDF"
          icon={<FaFilePdf className="h-4 w-4" />}
        />
        <DownloadButton
          href={md}
          label="Download Markdown"
          icon={<FaMarkdown className="h-4 w-4" />}
        />
      </div>

      {isError && (
        <p className="small-text text-red">
          Failed to generate the report. Make sure a scan has been run for this
          target first, then try Regenerate.
        </p>
      )}

      {/* Report preview (rendered Markdown -> styled HTML).
          Use an explicit viewport height: ancestors don't provide a definite height,
          so h-full/flex-1 would collapse the iframe. */}
      <div className="bg-gray rounded-6px flex h-[85vh] flex-col gap-3 p-4">
        {noScanForTarget ? (
          <div className="text-dark-yellowish-white flex h-full items-center justify-center text-center">
            {domain
              ? `No scan found for ${domain}. Run a scan on this target first.`
              : "Select a target and run a scan to generate a report."}
          </div>
        ) : loadingScan || (isPending && !data) ? (
          <div className="text-dark-yellowish-white flex h-full items-center justify-center">
            Generating report from scan findings…
          </div>
        ) : (
          <iframe
            title="Vulnerability Report Preview"
            srcDoc={data?.html_content || ""}
            className="rounded-6px h-full w-full overflow-auto border border-white/10 bg-[#ffffff]"
          />
        )}
      </div>
    </div>
  );
}

function DownloadButton({
  href,
  label,
  icon,
}: {
  href?: string;
  label: string;
  icon: ReactNode;
}) {
  const enabled = Boolean(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-disabled={!enabled}
      className={`small-text rounded-6px flex items-center gap-2 px-4 py-2 transition-colors ${
        enabled
          ? "bg-black/40 text-yellowish-white hover:bg-black/60 cursor-pointer"
          : "bg-black/20 text-dark-yellowish-white/40 pointer-events-none cursor-not-allowed"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}
