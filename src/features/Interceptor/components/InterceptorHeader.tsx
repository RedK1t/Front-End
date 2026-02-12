import forwardIcon from "@/assets/forwardIcon.svg";
import forwardAllIcon from "@/assets/forwardAllIcon.svg";
import dropIcon from "@/assets/closedTrashCanIcon.svg";
import dropAllIcon from "@/assets/openTrashCanIcon.svg";
import browserIcon from "@/assets/browserIcon.svg";
import interceptorOffIcon from "@/assets/interceptorOffIcon.svg";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import SwitchButton from "@/components/SwitchButton";
import { useSearchParams } from "react-router-dom";
import useProxyActions from "../hooks/useProxyActions";
import useProxyTraffic from "../hooks/useProxyTraffic";

export default function InterceptorHeader() {
  const [searchParams] = useSearchParams();
  const { forwardRequest, dropRequest, toggleIntercept, forwardAll, dropAll } =
    useProxyActions();
  const { interceptedRequests, interceptedResponses, interceptStatus } =
    useProxyTraffic();
  const interceptor = searchParams.get("Interceptor") === "true";
  const id = searchParams.get("selected");

  return (
    <div
      className={`flex items-center justify-between overflow-hidden text-nowrap transition-all duration-700 ${!interceptor ? "w-full opacity-100" : "w-0 opacity-0"}`}
    >
      <div className="flex items-center gap-x-3">
        <SwitchButton
          dataValue={interceptStatus}
          imgTransform={340}
          textTransform={30}
          buttonClassName="w-32"
          onIcon={interceptorOnIcon}
          offIcon={interceptorOffIcon}
          onText="Interceptor On"
          offText="Interceptor Off"
          onClick={() => {
            toggleIntercept(!interceptStatus);
          }}
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
        {/* FIXME: fix forward button */}
        <button
          onClick={() => {
            if (id) {
              forwardRequest(id, "", "", "", "");
            }
          }}
          className={`bg-red/60 small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Forward
          <img src={forwardIcon} alt="forwardIcon" className="h-4 w-4" />
        </button>

        {/* FIXME: fix forwardAll button */}
        <button
          onClick={() => {
            forwardAll([]);
          }}
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
          onClick={() => {
            if (id) {
              dropRequest(id);
            }
          }}
          className={`bg-red/60 small-text text-yellowish-white rounded-6px flex w-fit cursor-pointer items-center justify-between gap-2 px-3 py-2`}
        >
          Drop
          <img src={dropIcon} alt="dropIcon" className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            dropAll([
              ...interceptedRequests.map((req) => req.id),
              ...interceptedResponses.map((res) => res.id),
            ]);
          }}
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
      </div>
    </div>
  );
}
