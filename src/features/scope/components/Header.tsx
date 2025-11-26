import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import onIcon from "@/assets/onIcon.svg";
import offIcon from "@/assets/offIcon.svg";

type HeaderProps = {
  title: string;
  param: string;
};

export default function Header({ title, param }: HeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOnParam = searchParams.get(param);
  const [isOn, setIsOn] = useState(isOnParam === "true");

  // update search params when isOn changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(param, isOn.toString());
    setSearchParams(newSearchParams);
  }, [isOn, setSearchParams, searchParams, param]);

  return (
    <div className="border-dark-yellowish-white flex items-center justify-between border-b">
      <p className="heading-text">{title}</p>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`bg-gray small-text text-yellowish-white rounded-6px border-light-red flex w-16 cursor-pointer items-center justify-between border py-0.5 pr-0.5 pl-1.5`}
      >
        <p
          className={`transition-transform ${isOn ? "" : "translate-x-[160%]"}`}
        >
          {isOn ? "On" : "Off"}
        </p>
        <div
          className={`${isOn ? "bg-red" : ""} rounded-6px flex h-7 w-7 items-center justify-center transition-all ${isOn ? "" : "-translate-x-[115%]"}`}
        >
          <img
            src={isOn ? onIcon : offIcon}
            alt={isOn ? "offIcon" : "onIcon"}
            className="h-9/12 w-9/12 translate-x-px"
          />
        </div>
      </button>
    </div>
  );
}
