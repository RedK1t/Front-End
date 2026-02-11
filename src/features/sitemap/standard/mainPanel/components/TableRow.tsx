import getMethodColor from "@/utils/getMethodColor";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
export type TableRowProps = {
  id: string;
  lastSeen: string;
  source: string;
  status: number;
  method: string;
  path: string;
  selected: boolean;
  onClick: (id: string) => void;
};

export default function TableRow({
  lastSeen,
  source,
  status,
  method,
  path,
  id,
  selected,
  onClick,
}: TableRowProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        backgroundColor: "#CE323240",
      }}
      onClick={method === "Method" ? undefined : () => onClick(id)}
      className={`rounded-6px mx-auto flex w-[99%] ${method === "Method" ? "" : "cursor-pointer"} items-center justify-between px-4 py-2 text-center ${selected ? "bg-dark-red/20!" : ""}`}
    >
      {/* Last Seen */}
      <div className="w-1/6 text-center">
        {lastSeen
          ? formatDistanceToNow(new Date(lastSeen), {
              addSuffix: true,
              includeSeconds: true,
            })
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
      <div className="w-2/6 text-center">{decodeURIComponent(path)}</div>
    </motion.div>
  );
}
