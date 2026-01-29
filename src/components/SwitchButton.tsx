import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

type searchParam = {
  param: string;
  to?: null;
};

type navigate = {
  param?: null;
  to: string;
};

type SwitchButtonProps = (searchParam | navigate) & {
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
  to,
  onIcon,
  offIcon,
  onText,
  offText,
  buttonClassName,
  imgTransform,
  textTransform,
}: SwitchButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const currentPath = location.pathname; // This will be "/sitemap/what" or similar
  console.log(onIcon);
  const isOnParam = searchParams.get(param || "");
  const [isOn, setIsOn] = useState(
    param
      ? isOnParam === "true"
      : currentPath.includes(to?.split("/").pop() || ""),
  );
  const navigate = useNavigate();
  function handleClick() {
    if (to) {
      if (isOn) {
        navigate(-1);
      } else {
        navigate(to);
      }
      return;
    }
    if (param) {
      const newSearchParams = new URLSearchParams(searchParams);
      setIsOn(!isOn);
      const newIsOn = !isOn;
      newSearchParams.set(param, newIsOn.toString());
      setSearchParams(newSearchParams, { replace: true });
    }
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
        {onIcon.includes("data") ? (
          <img
            src={isOn ? onIcon : offIcon}
            alt={isOn ? "offIcon" : "onIcon"}
            className="h-9/12 w-9/12 translate-x-px"
          />
        ) : (
          <p className="normal-text">{isOn ? onIcon : offIcon}</p>
        )}
      </div>
    </button>
  );
}
