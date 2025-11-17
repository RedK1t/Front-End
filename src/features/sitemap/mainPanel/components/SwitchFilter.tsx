import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SwitchFilterProps = {
  offText: string;
  onText: string;
  onIcon: string;
  offIcon: string;
};
export default function SwitchFilter({
  offText,
  onText,
  onIcon,
  offIcon,
}: SwitchFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCheckedParam = searchParams.get(onText) || "true";
  const [isChecked, setIsChecked] = useState(isCheckedParam === "true");

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(onText, isChecked.toString());
    setSearchParams(newSearchParams, { replace: true });
  }, [isChecked, onText, searchParams, setSearchParams]);

  return (
    <div
      className={`bg-gray ${isChecked ? "flex-row" : "flex-row-reverse"} small-text flex h-8 w-fit items-center justify-between rounded-md px-0.5 text-white transition-all duration-300`}
    >
      <label className="swap px-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <div className="swap-on small-text text-center">{onText}</div>
        <div className="swap-off small-text text-center">{offText}</div>
      </label>

      <label className="swap">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <div className="swap-on large-text bg-red h-7 w-7 rounded-sm text-center">
          {onIcon}
        </div>
        <div className="swap-off large-text border-red flex h-7 w-7 items-center justify-center rounded-sm border text-center">
          {offIcon.includes("svg") ? (
            <img src={offIcon} alt={offText} className="h-8/10" />
          ) : (
            offIcon
          )}
        </div>
      </label>
    </div>
  );
}
