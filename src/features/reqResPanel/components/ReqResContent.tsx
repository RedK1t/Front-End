import CodeWrapper from "@/components/CodeWrapper";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import SwitchButton from "@/components/SwitchButton";
import ArrowsRightLeft from "@/assets/ArrowsRightLeft.svg";

type requestOrResponse = {
  requestAndResponse: false;
  type: "Request" | "Response" | "Request Template";
  text?: string;
  requestText?: undefined;
  responseText?: undefined;
};
type requestAndResponse = {
  requestAndResponse: true;
  type?: undefined;
  text?: undefined;
  requestText?: string;
  responseText?: string;
};
type ReqResContentProps = (requestOrResponse | requestAndResponse) & {
  editableProp?: boolean;
  comment?: string;
  onBlur?: (value: string) => void;
};

export default function ReqResContent({
  type,
  editableProp = true,
  comment,
  onBlur,
  ...props
}: ReqResContentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine which text to display based on mode and current view
  const displayText = props.requestAndResponse
    ? (searchParams.get("isItRes") === "true"
        ? props.responseText
        : props.requestText) || ""
    : props.text || "";
  const resOrReq =
    searchParams.get("isItRes") === "true" ? "Response" : "Request";
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setQuery("");
    setCount(0);
    setIndex(0);

    const newURL = new URLSearchParams(searchParams);

    newURL.delete(`Requestquery`);
    newURL.delete(`Responsequery`);
    setSearchParams(newURL, { replace: true });
  }, [resOrReq]);

  useEffect(() => {
    // wait until the classes are loaded
    setTimeout(() => {
      if (ref.current) {
        // Search ONLY inside this div
        const elements = ref.current.querySelectorAll(".ͼ12");
        setCount(elements.length);
        elements[0]?.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  }, [query]);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    const newURL = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newURL.delete(`${type || resOrReq}query`);
    } else {
      newURL.set(`${type || resOrReq}query`, e.target.value);
    }
    setSearchParams(newURL, { replace: true });
  }

  function handleClear() {
    setQuery("");
    setCount(0);
    setIndex(0);
    const newURL = new URLSearchParams(searchParams);
    newURL.delete(`${type || resOrReq}query`);
    setSearchParams(newURL, { replace: true });
  }

  function handlePrev() {
    if (index > 0) {
      setIndex(index - 1);
      const elements = ref.current?.querySelectorAll(".ͼ12");
      elements?.[index - 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleNext() {
    if (index < count - 1) {
      setIndex(index + 1);
      const elements = ref.current?.querySelectorAll(".ͼ12");
      elements?.[index + 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className={`flex h-full w-full flex-col gap-2.5 py-5`}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="mid-text text-yellowish-white">{type || resOrReq}</h2>
          <span className="text-dark-yellowish-white normal-text">
            {comment}
          </span>
        </div>
        {props.requestAndResponse && (
          <SwitchButton
            offIcon={ArrowsRightLeft}
            onIcon={ArrowsRightLeft}
            offText="Request"
            onText="Response"
            param="isItRes"
            textTransform={60}
            imgTransform={250}
            buttonClassName="w-26"
          />
        )}
      </div>

      {/* code */}
      <div
        ref={ref}
        className="bg-gray text-yellowish-white coding-text h-full min-h-25 w-full overflow-y-hidden rounded-[5px] p-2.5"
      >
        <CodeWrapper
          language="http"
          initialValue={displayText}
          editableProp={editableProp}
          type={type || resOrReq}
          onBlur={onBlur}
        />
      </div>

      {/* footer */}
      <div className="flex items-center gap-2.5">
        <div className="bg-gray rounded-6px flex w-full items-center pr-2.5">
          <Input
            placeholder="Search"
            className="bg-gray rounded-6px h-9 border-0 focus-visible:border-0 focus-visible:ring-0"
            onChange={handleOnChange}
            value={query}
          />
          <MdCancel
            onClick={handleClear}
            className="text-yellowish-white h-5 w-5 cursor-pointer"
          />
        </div>
        <button
          onClick={handlePrev}
          className="rounded-6px bg-gray flex h-9 w-12 cursor-pointer items-center justify-center"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="rounded-6px bg-gray flex h-9 w-12 cursor-pointer items-center justify-center"
        >
          <FaArrowRight />
        </button>
        <p className="normal-text ml-2.5 text-nowrap text-white">
          {count} matches found
        </p>
      </div>
    </div>
  );
}
