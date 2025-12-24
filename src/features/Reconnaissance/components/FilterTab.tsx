import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

type FilterTabProps = {
  paramName: string;
  paramData: string;
  children: ReactNode;
};
export default function FilterTab({
  paramName,
  paramData,
  children,
}: FilterTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabStyles =
    "normal-text px-2 py-1 cursor-pointer transition-all rounded-md duration-300";
  const hoverStyles =
    "ring-dark-yellowish-white shadow-yellowish-white/30 rounded-md ring text-white shadow-[0_0_10px]";

  // Handle click event to set filter parameter
  function handleClick() {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(paramName, paramData);
    setSearchParams(newParams, { replace: true });
  }

  return (
    <button
      className={`${tabStyles} ${
        searchParams.get(paramName) === paramData ? hoverStyles : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
