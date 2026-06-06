import { useSearchParams } from "react-router-dom";
import filterIcon from "@/assets/filterIcon.svg";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState, useMemo } from "react";
import useProxyActions from "../hooks/useProxyActions";
import trashIcon from "@/assets/closedTrashCanIcon.svg";
import useProxyTraffic from "../hooks/useProxyTraffic";

export default function HttpHistoryHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState("");
  const { clearHistory } = useProxyActions();
  const { history } = useProxyTraffic();

  const historyMode = searchParams.get("history") === "true";
  const length = searchParams.get("length") || "0";
  const selectedId = searchParams.get("selected");

  const sortedHistoryIds = useMemo(() => {
    return history.map((h) => h.id);
  }, [history]);

  function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", e.target.value);
    setSearchParams(newSearchParams, { replace: true });
  }

  function handleNext() {
    if (sortedHistoryIds.length === 0) return;
    const currentIndex = sortedHistoryIds.indexOf(selectedId || "");
    const nextIndex = (currentIndex + 1) % sortedHistoryIds.length;
    const nextId = sortedHistoryIds[nextIndex];

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", nextId);
    setSearchParams(newSearchParams, { replace: true });
  }

  function handlePrev() {
    if (sortedHistoryIds.length === 0) return;
    const currentIndex = sortedHistoryIds.indexOf(selectedId || "");
    const prevIndex =
      currentIndex <= 0 ? sortedHistoryIds.length - 1 : currentIndex - 1;
    const prevId = sortedHistoryIds[prevIndex];

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", prevId);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <div
      className={`${historyMode ? "w-full opacity-100" : "w-0 opacity-0"} flex h-fit overflow-hidden text-nowrap transition-all duration-700`}
    >
      <div className="bg-gray rounded-6px flex h-8 w-8 cursor-pointer items-center justify-center">
        <img src={filterIcon} alt="filterIcon" className="" />
      </div>

      <div className="text-yellowish-white flex w-full items-center justify-center gap-x-2.5">
        <p className="small-text"> {length} Highlights</p>
        <div className="bg-gray rounded-6px flex w-2/5 items-center justify-between pr-1.5">
          <Input
            placeholder="Search"
            value={searchString}
            onChange={handleOnchange}
            className="bg-gray h-7 border-0 focus-within:ring-0!"
          />
          <IoIosSearch className="cursor-pointer" />
        </div>
        <div
          onClick={handlePrev}
          className="rounded-6px bg-gray flex h-7 w-7 cursor-pointer items-center justify-center"
        >
          <FaArrowLeft />
        </div>
        <div
          onClick={handleNext}
          className="rounded-6px bg-gray flex h-7 w-7 cursor-pointer items-center justify-center"
        >
          <FaArrowRight />
        </div>
        <div
          onClick={clearHistory}
          className="rounded-6px bg-gray flex h-7 w-7 cursor-pointer items-center justify-center"
          title="Clear History"
        >
          <img src={trashIcon} alt="trashIcon" className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
