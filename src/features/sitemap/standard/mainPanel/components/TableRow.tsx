import getMethodColor from "@/utils/getMethodColor";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
type TableRowProps = {
  lastSeen: string;
  source: string;
  status: string;
  method: string;
  path: string;
};

export default function TableRow({
  lastSeen,
  source,
  status,
  method,
  path,
}: TableRowProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("selected") === `${method}-${path}`;
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", `${method}-${path}`);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <div
      onClick={method === "Method" ? undefined : handleSelect}
      className={`rounded-6px flex w-full ${method === "Method" ? "" : "cursor-pointer"} items-center justify-between px-4 py-2 text-center ${selected ? "bg-dark-red/20" : ""}`}
    >
      <div className="w-1/5 text-center">{lastSeen}</div>

      {/*  Source */}
      <div className="flex w-1/5 items-center justify-center">
        <div
          className={`w-14 rounded-[5px] text-center ${source === "Active" ? "bg-cyan-transparent text-cyan" : source === "Passive" ? "bg-orange-transparent text-yellow" : ""}`}
        >
          {source}
        </div>
      </div>

      {/* Status */}
      <div className="w-1/5 text-center">{status}</div>

      {/* Method */}
      <div className="flex w-1/5 items-center justify-center">
        <div
          className={`w-16 rounded-[3px] text-center ${getMethodColor(method)}`}
        >
          {method}
        </div>
      </div>

      {/* Path */}
      <div className="w-1/5 text-center">{path}</div>

      {/* Checkbox */}
      <div className="text-center">
        <div
          onClick={() => setIsChecked(!isChecked)}
          className={`flex h-5 w-5 items-center justify-center rounded text-center ${isChecked ? "bg-dark-red/70" : "border-dark-yellowish-white border"}`}
        >
          {isChecked ? <Check /> : ""}
        </div>
      </div>
    </div>
  );
}
