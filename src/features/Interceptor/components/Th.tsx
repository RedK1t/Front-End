import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

type ThProps = {
  children: string;
  left?: boolean;
  right?: boolean;
};
export default function Th({ children, left, right }: ThProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  function handleSort() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("selected");
    if (sort?.includes(`${children}`)) {
      if (sort.includes(`asc`)) {
        newSearchParams.set("sort", `${children}-desc`);
        setSearchParams(newSearchParams);
        return;
      }
      if (sort.includes(`desc`)) {
        newSearchParams.set("sort", `${children}-asc`);
        setSearchParams(newSearchParams);
        return;
      }
    }
    newSearchParams.set("sort", `${children}-asc`);
    setSearchParams(newSearchParams);
  }
  return (
    <th
      onClick={handleSort}
      className={`hover:bg-yellowish-white/15 cursor-pointer px-2 py-1 text-start transition-all duration-200 select-none ${left ? "rounded-l-[4px]" : right ? "rounded-r-[4px]" : ""}`}
    >
      <div className="flex items-center gap-2">
        {children}
        {sort === `${children}-asc` && (
          <FaSortAmountDown className="text-yellowish-white" />
        )}
        {sort === `${children}-desc` && (
          <FaSortAmountUpAlt className="text-yellowish-white" />
        )}

        {/* to maintain the same width of the th when there is and there is not a sort */}
        <FaSortAmountDown
          className={`text-yellowish-white opacity-0 ${sort?.includes(`${children}`) ? "hidden" : ""}`}
        />
      </div>
    </th>
  );
}
