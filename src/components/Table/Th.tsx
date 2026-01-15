import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

type ThProps = {
  children: string;
  left?: boolean;
  right?: boolean;
  index: number;
};
export default function Th({ index, children, left, right }: ThProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  function handleSort() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("selected");
    if (sort?.includes(`${index}`)) {
      if (sort.includes(`asc`)) {
        newSearchParams.set("sort", `${index}-desc`);
        setSearchParams(newSearchParams, { replace: true });
        return;
      }
      if (sort.includes(`desc`)) {
        newSearchParams.set("sort", `${index}-asc`);
        setSearchParams(newSearchParams, { replace: true });
        return;
      }
    }
    newSearchParams.set("sort", `${index}-asc`);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <th
      onClick={handleSort}
      className={`hover:bg-yellowish-white/15 cursor-pointer px-2 py-1 text-start transition-all duration-200 select-none ${left ? "rounded-l-6px" : right ? "rounded-r-6px" : ""}`}
    >
      <div className="flex items-center gap-2">
        {children}
        {sort === `${index}-asc` && (
          <FaSortAmountDown className="text-yellowish-white" />
        )}
        {sort === `${index}-desc` && (
          <FaSortAmountUpAlt className="text-yellowish-white" />
        )}

        {/* to maintain the same width of the th when there is and there is not a sort */}
        <FaSortAmountDown
          className={`text-yellowish-white opacity-0 ${sort?.includes(`${index}`) ? "hidden" : ""}`}
        />
      </div>
    </th>
  );
}
