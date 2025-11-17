import { Check } from "lucide-react";
import { useState } from "react";
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

  return (
    <>
      <div className="text-center">{lastSeen}</div>
      <div
        className={`w-14 rounded-[5px] text-center ${source === "Active" ? "bg-cyan-transparent text-cyan" : source === "Passive" ? "bg-orange-transparent text-yellow" : ""}`}
      >
        {source}
      </div>
      <div className="text-center">{status}</div>
      <div
        className={`w-16 rounded-[3px] text-center ${
          method === "GET"
            ? "bg-green-transparent text-green"
            : method === "POST"
              ? "bg-blue-transparent text-blue"
              : method === "PUT"
                ? "bg-orange-transparent text-yellow"
                : method === "DELETE"
                  ? "bg-dark-red/10 text-light-red"
                  : ""
        }`}
      >
        {method}
      </div>
      <div className="text-center">{path}</div>
      <div className="text-center">
        <div
          onClick={() => setIsChecked(!isChecked)}
          className={`border-dark-yellowish-white flex h-5 w-5 items-center justify-center rounded border text-center ${isChecked ? "bg-dark-red" : ""}`}
        >
          {isChecked ? <Check /> : ""}
        </div>
      </div>
    </>
  );
}
