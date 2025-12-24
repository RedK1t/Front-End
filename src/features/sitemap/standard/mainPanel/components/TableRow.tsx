import getMethodColor from "@/utils/getMethodColor";
import { useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
export type TableRowProps = {
  id: string;
  lastSeen: string;
  source: string;
  status: number;
  method: string;
  path: string;
};

export default function TableRow({
  lastSeen,
  source,
  status,
  method,
  path,
  id,
}: TableRowProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("selected") === id;
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", id);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <div
      onClick={method === "Method" ? undefined : handleSelect}
      className={`rounded-6px flex w-full ${method === "Method" ? "" : "cursor-pointer"} items-center justify-between px-4 py-2 text-center ${selected ? "bg-dark-red/20" : ""}`}
    >
      {/* Last Seen */}
      <div className="w-1/6 text-center">
        {lastSeen
          ? formatDistanceToNow(new Date(lastSeen), { addSuffix: true })
          : "N/A"}
      </div>

      {/*  Source */}
      <div className="flex w-1/6 items-center justify-center">
        <div
          className={`w-14 rounded-[5px] text-center ${source === "Active" ? "bg-cyan-transparent text-cyan" : source === "Passive" ? "bg-orange-transparent text-yellow" : ""}`}
        >
          {source}
        </div>
      </div>

      {/* Status */}
      <div className="w-1/6 text-center">{status}</div>

      {/* Method */}
      <div className="flex w-1/6 items-center justify-center">
        <div
          className={`w-16 rounded-[3px] text-center ${getMethodColor(method)}`}
        >
          {method}
        </div>
      </div>

      {/* Path */}
      <div className="w-2/6 text-center">{path}</div>
    </div>
  );
}
