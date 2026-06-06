import { useQueryClient } from "@tanstack/react-query";
import useScannerSocket from "./useScannerSocket";
import { useEffect, useRef } from "react";
import type { message, vulnerabilities } from "../types";
import type { RecentScannedSubdomains } from "@/features/types";
import { useDomain } from "@/context/DomainContext";

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
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage !== lastProcessedRef.current) {
      lastProcessedRef.current = lastJsonMessage;
      const type = lastJsonMessage.type;

      if (type === "scan_start") {
        // Reset counters/results so a new scan doesn't accumulate on top of the previous one
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
      }
    }
  }, [lastJsonMessage, queryClient]);
  return null;
}
