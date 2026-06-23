import TargetCard from "./TargetCard";
import useGetTargets from "../../../hooks/useGetTargets";
import Loader from "@/components/Loader";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { FiSearch } from "react-icons/fi";

export default function TargetCardList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: targets, isLoading } = useGetTargets();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const targetsToShow = targets
    ?.filter((item) => {
      if (!search) return true;
      return item.domain.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const resetSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("search");
    setSearchParams(newSearchParams, { replace: true });
  };

  return (
    <div className="mx-auto mt-14 flex min-h-full w-full flex-wrap items-center justify-center gap-4 pb-14 md:w-11/12 lg:justify-start xl:w-10/12">
      {isLoading ? (
        <div className="flex h-52 w-full items-center justify-center">
          <Loader />
        </div>
      ) : !search ? (
        <TargetCard isNew={true} />
      ) : null}
      {!isLoading &&
        search &&
        (!targetsToShow || targetsToShow.length === 0) && (
          <div className="flex w-full justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray/80 flex w-full max-w-2xl flex-col items-center justify-center gap-6 rounded-[14px] border border-white/10 p-10 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40">
                <FiSearch className="text-yellowish-white h-8 w-8 opacity-70" />
              </div>
              <div className="space-y-2">
                <h3 className="heading-text text-white">No targets found</h3>
                <p className="normal-text text-white/50">
                  No targets match <span className="text-red">"{search}"</span>.
                  Try a different search term or clear the filter.
                </p>
              </div>
              <button
                onClick={resetSearch}
                className="bg-red shadow-red/20 hover:bg-light-red hover:shadow-red/40 mid-text flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Clear Filter
              </button>
            </motion.div>
          </div>
        )}
      {!isLoading &&
        targetsToShow?.map((item) => (
          <TargetCard
            key={item.id}
            targetName={
              item.domain.split(".")[item.domain.split(".").length - 2]
            }
            targetDomain={item.domain}
            lastScanned={item.created_at}
          />
        ))}
    </div>
  );
}
