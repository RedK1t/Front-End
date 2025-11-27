import { useSearchParams } from "react-router-dom";
import filterIcon from "@/assets/filterIcon.svg";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";

export default function HttpHistoryHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState("");
  const interceptor = searchParams.get("Interceptor") === "true";
  const length = searchParams.get("length");
  const selected = searchParams.get("selected");
  function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", e.target.value);
    setSearchParams(newSearchParams);
  }
  function handleNext() {
    const newSearchParams = new URLSearchParams(searchParams);
    if (Number(selected) + 1 >= Number(length)) {
      newSearchParams.set("selected", "0");
    } else {
      newSearchParams.set("selected", String(Number(selected) + 1));
    }
    setSearchParams(newSearchParams);
  }
  function handlePrev() {
    const newSearchParams = new URLSearchParams(searchParams);
    if (Number(selected) - 1 < 0) {
      newSearchParams.set("selected", length || "0");
    } else {
      newSearchParams.set("selected", String(Number(selected) - 1));
    }
    setSearchParams(newSearchParams);
  }
  return (
    <div
      className={`${interceptor ? "w-0 opacity-0" : "w-full opacity-100"} flex h-fit overflow-hidden text-nowrap transition-all duration-700`}
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
      </div>
    </div>
  );
}
