import refetchImg from "@/assets/refetch.svg";
// import Loader from "@/components/Loader";
import { motion } from "motion/react";
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
  isFetching?: boolean;
  error?: Error | null;
  refetch?: () => void;
};

export default function Panel({
  title,
  children,
  filter,
  options,
  isFetching,
  error,
  refetch,
}: PanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filter || "");
  const ref = useRef<HTMLDivElement>(null);
  const [isNoData, setIsNoData] = useState(false);
  useEffect(() => {
    setIsNoData(ref?.current?.innerHTML === "");
  }, [children]);
  if (isFetching || error || isNoData) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gray rounded-6px text-dark-yellowish-white mb-4 flex h-fit max-h-150 min-h-20 w-full break-inside-avoid flex-col gap-2 overflow-hidden p-3"
    >
      {/*Header */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <p className="text-light-red large-text">{title}</p>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {options?.map((option) => (
            <>
              <button
                key={option}
                className={`cursor-pointer capitalize ${
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

          {/* Refetch */}
          <button className="cursor-pointer" title="Refetch" onClick={refetch}>
            <img src={refetchImg} alt="refetch" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {/* {isFetching && (
        <div className="flex h-52 items-center justify-center">
          <Loader />
        </div>
      )} */}

      {/* Error */}
      {/* {error && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-light-red normal-text font-bold">
              Failed to load data
            </p>
            <p className="small-text text-dark-yellowish-white max-w-50 text-center opacity-80">
              {error.message}
            </p>
          </div>
          <button
            onClick={refetch}
            className="bg-dark-red hover:bg-red rounded-6px flex cursor-pointer items-center gap-2 px-5 py-2 transition-all duration-200 active:scale-95"
          >
            <img
              src={refetchImg}
              alt=""
              className="h-4 w-4 brightness-200 contrast-200"
            />
            <span className="normal-text font-bold text-white">Retry</span>
          </button>
        </div>
      )} */}

      {/* Data */}
      {!isFetching && !error && !isNoData && (
        <div
          ref={ref}
          className="flex h-full w-full flex-col gap-y-2 overflow-y-auto"
        >
          {children}
        </div>
      )}

      {/* No Data */}
      {isNoData && !isFetching && !error && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <p className="large-text text-dark-yellowish-white font-bold opacity-40">
            No data available
          </p>
          <button
            onClick={refetch}
            className="bg-dark-red hover:bg-red rounded-6px flex cursor-pointer items-center gap-2 px-5 py-2 transition-all duration-200 active:scale-95"
          >
            <img
              src={refetchImg}
              alt=""
              className="h-4 w-4 brightness-200 contrast-200"
            />
            <span className="normal-text font-bold text-white">Refetch</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
