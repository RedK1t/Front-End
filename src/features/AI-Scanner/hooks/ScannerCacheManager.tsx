import { useQueryClient } from "@tanstack/react-query";
import useScannerSocket from "./useScannerSocket";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { message, vulnerabilities } from "../types";
import type { RecentScannedSubdomains } from "@/features/types";
import { useDomain } from "@/context/DomainContext";
import { insertScan } from "@/api/supabase";

// Best-effort host label from a URL, used when no working domain is set (e.g. raw-request scans).
function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function ScannerCacheManager() {
  const { lastJsonMessage } = useScannerSocket();
  const queryClient = useQueryClient();
  const { domain } = useDomain();
  function handleNewVulnerability() {
    if (!domain) return;
    const currentRaw = localStorage.getItem("scannedSubdomains");
    if (!currentRaw) return;

    try {
      const currentScanned: RecentScannedSubdomains = JSON.parse(currentRaw);
      const updatedScanned = currentScanned.map((item) => {
        if (item.targetDomain === domain) {
          return {
            ...item,
            vulnerabilitiesFound: (item.vulnerabilitiesFound || 0) + 1,
          };
        }
        return item;
      });
      localStorage.setItem("scannedSubdomains", JSON.stringify(updatedScanned));
    } catch (e) {
      console.error("Failed to update vulnerabilities count", e);
    }
  }

  // Ref to track the last processed message to prevent double-processing
  const lastProcessedRef = useRef<message>(null);
  // Ref so a completed scan is saved to history exactly once (per scan_id).
  const savedScanIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage !== lastProcessedRef.current) {
      lastProcessedRef.current = lastJsonMessage;
      const type = lastJsonMessage.type;

      if (type === "scan_start") {
        // Remember this scan's identity so we can label it when saving on completion.
        queryClient.setQueryData(["current-scan-meta"], {
          scan_id: lastJsonMessage.scan_id,
          target_url: lastJsonMessage.target_url,
        });
        // Reset counters/results so a new scan doesn't accumulate on top of the previous one.
        // The previous scan is already saved to history on its scan_complete, so this is safe.
        queryClient.setQueryData(["vulnerabilities"], []);
        queryClient.setQueryData(["total-payloads"], 0);
        queryClient.setQueryData(["endpoints-scanned"], 0);
      }
      if (type === "vulnerability_found") {
        const vulnerability = lastJsonMessage.vulnerability;
        queryClient.setQueryData(
          ["vulnerabilities"],
          (oldData: vulnerabilities) =>
            oldData
              ? [...oldData, { ...vulnerability, id: oldData.length + 1 }]
              : [{ ...vulnerability, id: 1 }],
        );
        handleNewVulnerability();
      }
      if (type === "progress") {
        // Backend sends the cumulative count; set the max seen (robust to missed messages)
        const tested = lastJsonMessage.tested;
        if (typeof tested === "number") {
          queryClient.setQueryData(["total-payloads"], (oldData: number) =>
            Math.max(oldData || 0, tested),
          );
        }
      }
      if (type === "endpoint_transition") {
        queryClient.setQueryData(
          ["endpoints-scanned"],
          (oldData: number) => (oldData || 0) + 1,
        );
      }
      if (type === "scan_complete") {
        // Authoritative final totals from the backend
        const result = lastJsonMessage.result;
        if (result) {
          queryClient.setQueryData(
            ["total-payloads"],
            result.total_payloads_tested ?? 0,
          );
          queryClient.setQueryData(
            ["endpoints-scanned"],
            result.total_endpoints ?? 0,
          );
        }

        // Persist this completed scan to history (once per scan_id), so it isn't lost
        // when the next scan starts or the page reloads.
        const scanId = lastJsonMessage.scan_id;
        if (scanId && savedScanIdRef.current !== scanId) {
          savedScanIdRef.current = scanId;
          const vulns =
            (queryClient.getQueryData(["vulnerabilities"]) as vulnerabilities) ||
            [];
          const meta = queryClient.getQueryData(["current-scan-meta"]) as
            | { scan_id?: string; target_url?: string }
            | undefined;
          const targetUrl = meta?.target_url ?? null;
          insertScan({
            domain: domain ?? hostFromUrl(targetUrl),
            target_url: targetUrl,
            scan_id: scanId,
            summary: result ?? null,
            vulnerabilities: vulns,
          })
            .then(() =>
              queryClient.invalidateQueries({ queryKey: ["scans"] }),
            )
            .catch((err) => {
              console.error("[scanner] failed to save scan history:", err);
              toast.error("Couldn't save this scan to history.");
            });
        }
      }
    }
  }, [lastJsonMessage, queryClient]);
  return null;
}
