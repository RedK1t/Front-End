import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mindMapIcon from "@/assets/mind-map.svg";

function StandardSwitch() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(
    pathname.includes("standard"),
  );

  function handleChange() {
    setIsChecked((prev) => !prev);
    if (isChecked) {
      navigate("/proxy/sitemap/hierarchical");
    } else {
      navigate("/proxy/sitemap/standard");
    }
  }

  return (
    <div
      onChange={handleChange}
      className={`bg-gray small-text flex h-8 w-fit items-center justify-between rounded-md px-0.5 text-white transition-all duration-300`}
    >
      {/* SwitchFilter Text */}
      <label
        className={`swap px-2 transition-transform duration-1000 ${isChecked ? "translate-x-[35%]" : ""}`}
      >
        <input type="checkbox" checked={isChecked} />
        <div className="swap-on small-text text-center">Standard</div>
        <div className="swap-off small-text text-center">Hierarchical</div>
      </label>

      {/* SwitchFilter Icon */}
      <label
        className={`swap transition-transform duration-1000 ${isChecked ? "-translate-x-[290%]" : ""}`}
      >
        <input type="checkbox" checked={isChecked} />
        <div className="swap-on large-text bg-red h-7 w-7 rounded-sm text-center">
          /
        </div>
        <div className="swap-off large-text border-red flex h-7 w-7 items-center justify-center rounded-sm border text-center">
          <img src={mindMapIcon} alt="Mind Map" />
        </div>
      </label>
    </div>
  );
}

export default memo(StandardSwitch);
