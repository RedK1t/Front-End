import { useQueryClient } from "@tanstack/react-query";
import useScannerSocket from "./useScannerSocket";
import { useEffect, useRef } from "react";
import type { message, vulnerabilities } from "../types";

export default function ScannerCacheManager() {
  const { lastJsonMessage } = useScannerSocket();
  const queryClient = useQueryClient();

  // Ref to track the last processed message to prevent double-processing
  const lastProcessedRef = useRef<message>(null);
  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage !== lastProcessedRef.current) {
      lastProcessedRef.current = lastJsonMessage;
      const type = lastJsonMessage.type;
      if (type === "vulnerability_found") {
        const vulnerability = lastJsonMessage.vulnerability;
        queryClient.setQueryData(
          ["vulnerabilities"],
          (oldData: vulnerabilities) =>
            oldData
              ? [...oldData, { ...vulnerability, id: oldData.length + 1 }]
              : [{ ...vulnerability, id: 1 }],
        );
      }
      if (type === "progress") {
        queryClient.setQueryData(
          ["total-payloads"],
          (oldData: number) => oldData + 1,
        );
      }
      if (type === "endpoint_transition") {
        queryClient.setQueryData(
          ["endpoints-scanned"],
          (oldData: number) => oldData + 1,
        );
      }
    }
  }, [lastJsonMessage, queryClient]);
  return null;
}
