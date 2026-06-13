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
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-gray p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mid-text text-white">Vulnerabilities Found</h2>
          <p className="small-text text-dark-yellowish-white mt-1">
            {vulnerabilities.length} potential issues detected
          </p>
        </div>
        <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-3 md:w-80">
          <FaMagnifyingGlass className="text-white/40" />
          <Input
            placeholder="Search by path or vulnerability type"
            className="small-text flex-1 border-0 bg-transparent p-0 text-white placeholder:text-white/30 focus-visible:ring-0"
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
        </div>
      </div>
      <div className="h-56 overflow-hidden rounded-xl border border-white/5 bg-black/30">
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
