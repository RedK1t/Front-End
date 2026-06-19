import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteScan, getScan, getScans } from "@/api/supabase";
import { useDomain } from "@/context/DomainContext";
import type { ScanRecordMeta } from "@/types/types";

// Extract the host from a URL so a scan stored only with a target_url can still
// be matched against the current target.
function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

// Lists the user's saved scans and lets a past scan be loaded into the existing display
// caches (so ResultsTable / DetailsCard / InfoCardsList render it unchanged).
export default function useScanHistory() {
  const queryClient = useQueryClient();
  const { domain } = useDomain();

  const { data: allScans = [], isLoading } = useQuery<ScanRecordMeta[]>({
    queryKey: ["scans"],
    queryFn: getScans,
  });

  // When a target is being tested, scope history to it: a scan belongs to the
  // current target when its `domain` matches, or (for scans saved without a
  // domain) when its target_url's host matches. When no target is selected — e.g.
  // a Quick Scan launched straight from the Interceptor, which never sets a domain
  // — show ALL of this user's scans instead of nothing (getScans already scopes to
  // the logged-in user), so freshly found scans are still visible and reportable.
  const scans = domain
    ? allScans.filter(
        (scan) =>
          scan.domain === domain || hostFromUrl(scan.target_url) === domain,
      )
    : allScans;

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
