import Th from "./Th";
import { useSearchParams } from "react-router-dom";
import Tr from "./Tr";
import { useEffect, useRef } from "react";
import Td from "./Td";
import leftArrowIcon from "@/assets/leftArrowIcon.svg";
import rightArrowIcon from "@/assets/rightArrowIcon.svg";
import checkIcon from "@/assets/CheckMarkIcon.svg";

type TableProps = {
  headers: string[];
  data: (string | number | boolean)[][];
  idColumnIndex?: number;
  onSelectionChange?: (selected: string) => void;
};
export default function Table({
  headers,
  data,
  idColumnIndex,
  onSelectionChange,
}: TableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");
  const selected = searchParams.get("selected");
  const lastSelectedRef = useRef<string | null>(null);

  useEffect(() => {
    if (selected && selected !== lastSelectedRef.current) {
      onSelectionChange?.(selected);
      lastSelectedRef.current = selected;
    } else if (!selected) {
      lastSelectedRef.current = null;
    }
  }, [selected, onSelectionChange]);

  const filteredTable = data.filter((row) => {
    return row.some((value) =>
      String(value)
        .toLowerCase()
        .includes(search?.toLowerCase() || ""),
    );
  });
  useEffect(() => {
    // Only update if search params actually change to avoid infinite loops
    if (searchParams.get("length") !== String(filteredTable.length)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("length", String(filteredTable.length));
      // Use a timeout to move the update out of the render cycle
      const timeoutId = setTimeout(() => {
        setSearchParams(newSearchParams, { replace: true });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [filteredTable.length, searchParams, setSearchParams]);

  const sortedTable = filteredTable?.sort((a, b) => {
    if (sort) {
      const split = sort.split("-");
      const columnIndex = parseInt(split[0]);
      const order = split[1] === "asc" ? 1 : -1;
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * order;
      }
      return String(aVal).localeCompare(String(bVal)) * order;
    }
    return 0;
  });
  return (
    <div className="h-full overflow-auto">
      <table className="w-full">
        <thead className="small-text text-yellowish-white bg-yellowish-white/15 sticky top-0 z-10 backdrop-blur-md">
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
          {sortedTable.map((row, i) => {
            const trIndex =
              idColumnIndex !== undefined ? Number(row[idColumnIndex]) : i;
            return (
              <Tr key={i} index={trIndex}>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
