import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type SwitchButtonProps = {
  param: string;
  onIcon: string;
  offIcon: string;
  onText: string;
  offText: string;
  buttonClassName?: string;
  textTransform: number;
  imgTransform: number;
};

export default function SwitchButton({
  param,
  onIcon,
  offIcon,
  onText,
  offText,
  buttonClassName,
  imgTransform,
  textTransform,
}: SwitchButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOnParam = searchParams.get(param);
  const [isOn, setIsOn] = useState(isOnParam === "true");
  function handleClick() {
    const newSearchParams = new URLSearchParams(searchParams);
    setIsOn(!isOn);
    const newIsOn = !isOn;
    newSearchParams.set(param, newIsOn.toString());
    setSearchParams(newSearchParams);
  }

  return (
    <button
      onClick={handleClick}
      className={`bg-gray small-text text-yellowish-white rounded-6px flex cursor-pointer items-center justify-between py-0.5 pr-0.5 pl-1.5 ${buttonClassName}`}
    >
      <p
        className="mx-auto transform transition-transform"
        style={{
          transform: isOn ? undefined : `translateX(${textTransform}%)`,
        }}
      >
        {isOn ? onText : offText}
      </p>
      <div
        className={`${isOn ? "bg-red" : "border"} border-red rounded-6px flex h-7 w-7 transform items-center justify-center transition-all`}
        style={{
          transform: isOn ? undefined : `translateX(-${imgTransform}%)`,
        }}
      >
        <img
          src={isOn ? onIcon : offIcon}
          alt={isOn ? "offIcon" : "onIcon"}
          className="h-9/12 w-9/12 translate-x-px"
        />
      </div>
    </button>
  );
}
