import Th from "./Th";
import { useSearchParams } from "react-router-dom";
import Tr from "./Tr";
import { useEffect } from "react";
import Td from "./Td";
import leftArrowIcon from "@/assets/leftArrowIcon.svg";
import rightArrowIcon from "@/assets/rightArrowIcon.svg";
import checkIcon from "@/assets/CheckMarkIcon.svg";

type TableProps = {
  headers: string[];
  data: (string | number | boolean)[][];
};
export default function Table({ headers, data }: TableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");
  const filteredTable = data.filter((row) => {
    return row.some((value) =>
      String(value)
        .toLowerCase()
        .includes(search?.toLowerCase() || ""),
    );
  });
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("length", String(filteredTable.length));
    setSearchParams(newSearchParams, { replace: true });
  }, [filteredTable.length, searchParams, setSearchParams]);

  const sortedTable = filteredTable?.sort((a, b) => {
    if (sort) {
      const columnIndex = parseInt(sort.split("-")[0]);
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];
      const order = sort.includes("asc") ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * order;
      }
      return String(aVal).localeCompare(String(bVal)) * order;
    }
    return 0;
  });
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="small-text text-yellowish-white bg-yellowish-white/15">
          <tr>
            {headers.map((header, i) => (
              <Th
                index={i}
                left={i === 0}
                right={i === headers.length - 1}
                key={header}
              >
                {header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTable.map((row, i) => (
            <Tr key={i} index={i}>
              {row.map((cell, j) => {
                if (cell === "Request")
                  return (
                    <Td key={j} left={j === 0} right={j === row.length - 1}>
                      <div className="flex items-center gap-1">
                        <img src={leftArrowIcon} alt="Left Arrow" />
                        <p>Request</p>
                      </div>
                    </Td>
                  );
                if (cell === "Response")
                  return (
                    <Td key={j} left={j === 0} right={j === row.length - 1}>
                      <div className="flex items-center gap-1">
                        <img src={rightArrowIcon} alt="Right Arrow" />
                        <p>Response</p>
                      </div>
                    </Td>
                  );
                if (cell === true) {
                  return (
                    <Td key={j} left={j === 0} right={j === row.length - 1}>
                      <img src={checkIcon} alt="Check Mark" />
                    </Td>
                  );
                }
                return (
                  <Td key={j} left={j === 0} right={j === row.length - 1}>
                    {cell}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
