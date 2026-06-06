import Table from "@/components/Table/Table";
import { Input } from "@/components/ui/input";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import useScannerTraffic from "../hooks/useScannerTraffic";
import type { vulnType } from "../types";

const VULN_TYPE_LABELS: Record<vulnType, string> = {
  sql_injection: "SQL Injection",
  reflected_xss: "Reflected XSS",
};

export default function ResultsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { vulnerabilities } = useScannerTraffic();

  return (
    <div className="bg-gray flex w-full flex-col gap-3 rounded-xl p-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-yellowish-white mid-text">Vulnerabilities Found</p>
        <div className="rounded-6px flex w-full max-w-80 items-center justify-between bg-black pr-2">
          <Input
            placeholder="Search by path or vulnerability type"
            className="small-text col-span-2 border-0 focus-visible:ring-0"
            value={searchParams.get("search") || ""}
            onChange={(e) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value === "") {
                newSearchParams.delete("search");
              } else {
                newSearchParams.set("search", e.target.value);
              }
              setSearchParams(newSearchParams, { replace: true });
            }}
          />
          <FaMagnifyingGlass />
        </div>
      </div>
      <div className="rounded-6px h-52 overflow-hidden bg-black">
        <Table
          headers={[
            "id",
            "severity",
            "Vulnerability Type",
            "Endpoint",
            "Payload Used",
          ]}
          data={vulnerabilities.map((vuln) => [
            vuln.id,
            vuln.severity || "-",
            VULN_TYPE_LABELS[vuln.vuln_type] || vuln.vuln_type || "Unknown",
            vuln.url,
            vuln.payload,
          ])}
        />
      </div>
    </div>
  );
}
