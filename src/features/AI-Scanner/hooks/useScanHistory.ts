import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteScan, getScan, getScans } from "@/api/supabase";
import type { ScanRecordMeta } from "@/types/types";

// Lists the user's saved scans and lets a past scan be loaded into the existing display
// caches (so ResultsTable / DetailsCard / InfoCardsList render it unchanged).
export default function useScanHistory() {
  const queryClient = useQueryClient();

  const { data: scans = [], isLoading } = useQuery<ScanRecordMeta[]>({
    queryKey: ["scans"],
    queryFn: getScans,
  });

  // Which saved scan is currently shown (null = the live/most-recent in-memory results).
  const { data: viewingScanId } = useQuery<string | null>({
    queryKey: ["viewing-scan-id"],
    queryFn: () => null,
    initialData: null,
    staleTime: Infinity,
  });

  async function loadScan(id: string) {
    try {
      const record = await getScan(id);
      if (!record) return;
      queryClient.setQueryData(["vulnerabilities"], record.vulnerabilities ?? []);
      queryClient.setQueryData(
        ["total-payloads"],
        record.summary?.total_payloads_tested ?? 0,
      );
      queryClient.setQueryData(
        ["endpoints-scanned"],
        record.summary?.total_endpoints ?? 0,
      );
      queryClient.setQueryData(["viewing-scan-id"], id);
    } catch (err) {
      console.error("[scanner] failed to open scan:", err);
      toast.error("Couldn't open that scan.");
    }
  }

  async function removeScan(id: string) {
    try {
      await deleteScan(id);
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      if (queryClient.getQueryData(["viewing-scan-id"]) === id) {
        queryClient.setQueryData(["viewing-scan-id"], null);
      }
      toast.success("Scan deleted.");
    } catch (err) {
      console.error("[scanner] failed to delete scan:", err);
      toast.error("Couldn't delete that scan.");
    }
  }

  return { scans, isLoading, viewingScanId: viewingScanId ?? null, loadScan, removeScan };
}
