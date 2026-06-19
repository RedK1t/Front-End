import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFileWord, FaFilePdf, FaMarkdown } from "react-icons/fa";
import useGenerateReport from "./hooks/useGenerateReport";
import useScanHistory from "@/features/AI-Scanner/hooks/useScanHistory";
import { useDomain } from "@/context/DomainContext";
import { getScan } from "@/api/supabase";
import type { vulnerabilities } from "@/features/AI-Scanner/types";

// Drop duplicate findings when merging several scans of the same target. Two
// findings are "the same" when they hit the same param at the same URL/method
// with the same payload — keeping different payloads against one param distinct.
function dedupeVulns(vulns: vulnerabilities): vulnerabilities {
  const seen = new Set<string>();
  return vulns.filter((v) => {
    const key = `${v.vuln_type}|${v.url}|${v.method}|${JSON.stringify(
      v.parameter,
    )}|${v.payload}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
  const { scans, isLoading: historyLoading } = useScanHistory();

  // Scans chosen in Scan History to merge into one report. Set by the
  // "Generate report from N selected" button (and cleared to [] by the AI
  // Scanner's single "Generate Report" button). Empty → use the latest scan.
  const { data: selectedIds = [] } = useQuery<string[]>({
    queryKey: ["report-selection"],
    queryFn: () => [],
    initialData: [],
    staleTime: Infinity,
  });
  const latest = scans[0] ?? null;
  const ids =
    selectedIds.length > 0 ? selectedIds : latest ? [latest.id] : [];

  // Fetch every chosen scan's full findings, then merge + dedupe them so the
  // report covers e.g. an XSS from one scan AND an SQLi from another.
  const { data: merged, isLoading: mergeLoading } = useQuery({
    queryKey: ["merged-scan", ids],
    queryFn: async () => {
      const records = (await Promise.all(ids.map((id) => getScan(id)))).filter(
        (r): r is NonNullable<typeof r> => Boolean(r),
      );
      const vulnerabilities = dedupeVulns(
        records.flatMap((r) => r.vulnerabilities ?? []),
      );
      const target_url = records[0]?.target_url ?? domain ?? "Unknown";
      return { vulnerabilities, target_url, scanCount: records.length };
    },
    enabled: ids.length > 0,
  });

  const { generateReport, data, isError, isPending, reset } =
    useGenerateReport();

  // Build the report from the merged findings. Re-runs when the selection (or
  // its findings) changes; clears when there is no scan to report.
  useEffect(() => {
    if (merged) {
      generateReport({
        target_url: merged.target_url,
        vulnerabilities: merged.vulnerabilities,
      });
    } else if (ids.length === 0) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged]);

  const loadingScan = historyLoading || (ids.length > 0 && mergeLoading);
  const noScanForTarget = !loadingScan && ids.length === 0;

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
              merged &&
              generateReport({
                target_url: merged.target_url,
                vulnerabilities: merged.vulnerabilities,
              })
            }
            disabled={isPending || !merged}
            className={`small-text rounded-6px px-4 py-2 transition-colors ${
              isPending || !merged
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
            // The report embeds the findings' payloads/raw responses, which for
            // reflected-XSS results contain live <script> (e.g. confirm(1)). An
            // un-sandboxed srcDoc iframe EXECUTES them. `sandbox` (no allow-scripts)
            // still renders the report's HTML/CSS but blocks all script execution.
            sandbox=""
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
