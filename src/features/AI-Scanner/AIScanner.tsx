import ResultsTable from "./components/ResultsTable";
import DetailsCard from "./components/DetailsCard";
import ScannerCacheManager from "./hooks/ScannerCacheManager";
import { useEffect } from "react";
import useScannerActions from "./hooks/useScannerActions";
import { useSearchParams } from "react-router-dom";
import InfoCardsList from "./components/InfoCardsList";

export default function AIScanner() {
  const { startScan } = useScannerActions();
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  useEffect(() => {
    if (url) {
      startScan(url);
    }
  }, []);
  return (
    <>
      <ScannerCacheManager />
      <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 overflow-hidden py-5">
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
