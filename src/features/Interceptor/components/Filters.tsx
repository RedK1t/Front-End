import SwitchButton from "@/components/SwitchButton";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import interceptorOffIcon from "@/assets/interceptorOffIcon.svg";
import forwardIcon from "@/assets/forwardIcon.svg";
import forwardAllIcon from "@/assets/forwardAllIcon.svg";
import dropIcon from "@/assets/closedTrashCanIcon.svg";
import dropAllIcon from "@/assets/openTrashCanIcon.svg";
import httpHistoryIcon from "@/assets/HttpHistoryIcon.svg";
import browserIcon from "@/assets/browserIcon.svg";

export default function Filters() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        <SwitchButton
          param="interceptorOn"
          imgTransform={340}
          textTransform={30}
          buttonClassName="w-32"
          onIcon={interceptorOnIcon}
          offIcon={interceptorOffIcon}
          onText="Interceptor On"
          offText="Interceptor Off"
        />
        {/* <SwitchButton
          param="forward"
          imgTransform={285}
          textTransform={40}
          buttonClassName="w-28"
          onIcon={forwardIcon}
          offIcon={forwardAllIcon}
          onText="Forward"
          offText="Forward All"
        /> */}
        <button
          className={`bg-red/60 small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Forward
          <img src={forwardIcon} alt="forwardIcon" className="h-4 w-4" />
        </button>
        <button
          className={`bg-gray small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Forward All
          <img src={forwardAllIcon} alt="forwardAllIcon" className="h-4 w-4" />
        </button>
        {/* <SwitchButton
          param="drop"
          imgTransform={225}
          textTransform={50}
          buttonClassName="w-24"
          onIcon={dropIcon}
          offIcon={dropAllIcon}
          onText="Drop"
          offText="Drop All"
          /> */}
      </div>
      <div className="flex items-center gap-x-2">
        <button
          className={`bg-red/60 small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Drop
          <img src={dropIcon} alt="dropIcon" className="h-4 w-4" />
        </button>
        <button
          className={`bg-gray small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Drop All
          <img src={dropAllIcon} alt="dropAllIcon" className="h-4 w-4" />
        </button>
        <button
          className={`bg-gray small-text text-yellowish-white rounded-6px flex w-32 cursor-pointer items-center justify-between px-3 py-2`}
        >
          Open Browser
          <img src={browserIcon} alt="browserIcon" className="h-4 w-4" />
        </button>
        <SwitchButton
          param="Interceptor"
          imgTransform={340}
          textTransform={35}
          buttonClassName="w-32"
          onIcon={interceptorOnIcon}
          offIcon={httpHistoryIcon}
          onText="Interceptor"
          offText="HTTP History"
        />
      </div>
    </div>
  );
}
