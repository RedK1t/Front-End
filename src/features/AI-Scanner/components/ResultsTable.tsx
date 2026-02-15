import Table from "@/components/Table/Table";
import { Input } from "@/components/ui/input";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

export default function ResultsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
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
      <div className="rounded-6px h-35 overflow-hidden bg-black">
        <Table
          headers={[
            "id",
            "severity",
            "Vulnerability Type",
            "Endpoint",
            "Payload Used",
          ]}
          data={[
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
            ["1", "High", "SQL Injection", "/api/user", "12345"],
          ]}
        />
      </div>
    </div>
  );
}
