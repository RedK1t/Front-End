import refetch from "@/assets/refetch.svg";
import Loader from "@/components/Loader";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
type PanelFilterProps = {
  filter: string;
  options: string[];
};
type PanelNoFilterProps = {
  filter?: undefined;
  options?: undefined;
};
type PanelProps = (PanelFilterProps | PanelNoFilterProps) & {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
};

export default function Panel({
  title,
  children,
  filter,
  options,
  isLoading,
  error,
}: PanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filter || "");
  const ref = useRef<HTMLDivElement>(null);
  const [isNoData, setIsNoData] = useState(false);
  useEffect(() => {
    setIsNoData(ref?.current?.innerHTML === "");
  }, [children]);
  return (
    <div className="bg-gray rounded-6px text-dark-yellowish-white mb-4 flex h-fit max-h-150 min-h-75 w-full break-inside-avoid flex-col gap-2 overflow-auto p-3">
      {/*Header */}
      <div className="flex items-center justify-between">
        <p className="text-light-red large-text">{title}</p>
        <div className="flex items-center gap-2">
          {options?.map((option) => (
            <>
              <button
                key={option}
                className={`cursor-pointer ${
                  currentFilter === option
                    ? "text-yellowish-white"
                    : "text-dark-yellowish-white"
                }`}
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set(filter, option);
                  setSearchParams(newSearchParams);
                }}
              >
                {option}
              </button>
            </>
          ))}
          <button className="cursor-pointer" title="Refetch">
            <img src={refetch} alt="refetch" className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="flex h-52 items-center justify-center">
          <Loader />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center">
          <p>Error: {error.message}</p>
        </div>
      )}
      {/* Data */}
      <div ref={ref} className="flex h-full w-full flex-col gap-y-2">
        {children}
      </div>
      {isNoData && !isLoading && !error && (
        <div className="large-text flex h-full w-full items-center justify-center">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
