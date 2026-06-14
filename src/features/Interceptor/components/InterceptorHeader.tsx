import forwardIconRaw from "@/assets/forwardIcon.svg?raw";
import forwardAllIconRaw from "@/assets/forwardAllIcon.svg?raw";
import dropIconRaw from "@/assets/closedTrashCanIcon.svg?raw";
import dropAllIconRaw from "@/assets/openTrashCanIcon.svg?raw";
import browserIconRaw from "@/assets/browserIcon.svg?raw";
import interceptorOffIcon from "@/assets/interceptorOffIcon.svg";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import SwitchButton from "@/components/SwitchButton";
import { useSearchParams } from "react-router-dom";
import useProxyActions from "../hooks/useProxyActions";
import useProxyTraffic from "../hooks/useProxyTraffic";
import { useProxySession } from "../context/ProxySessionContext";

// The toolbar icons are single-color SVGs with a hard-coded light stroke (#D7CCBC), so as
// <img> they vanish on the light theme's light surfaces. Inline the SVG markup and swap that
// fixed color for `currentColor` so each icon draws in its button's (theme-aware) text color.
function ButtonIcon({
  raw,
  className = "h-4 w-4",
}: {
  raw: string;
  className?: string;
}) {
  const tinted = raw.replace(/#D7CCBC/gi, "currentColor");
  return (
    <span
      aria-hidden
      className={`inline-block ${className} [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: tinted }}
    />
  );
}

// One shape for every toolbar button; two intents. Neutral uses theme-aware tokens
// (adapts light/dark); danger is a fixed brand red with fixed light text so it reads
// identically in both themes. Icons follow `currentColor`, so they match automatically.
const BTN_BASE =
  "small-text rounded-6px flex items-center justify-between gap-2 px-3 py-2 transition-colors";
const BTN_NEUTRAL =
  "bg-gray text-white border border-white/10 hover:bg-white/10 cursor-pointer";
const BTN_DANGER =
  "bg-red text-[#F5F1EC] hover:bg-light-red border border-transparent cursor-pointer";

export default function InterceptorHeader() {
  const [searchParams] = useSearchParams();
  const { openViewer, vncUrl, viewerBlocked } = useProxySession();
  const {
    forwardRequest,
    forwardResponse,
    dropRequest,
    toggleIntercept,
    forwardAll,
    dropAll,
  } = useProxyActions();
  const { interceptedRequests, interceptedResponses, interceptStatus } =
    useProxyTraffic();
  const historyMode = searchParams.get("history") === "true";
  const id = searchParams.get("selected");

  return (
    <div
      className={`flex items-center justify-between overflow-hidden text-nowrap transition-all duration-700 ${!historyMode ? "w-full opacity-100" : "w-0 opacity-0"}`}
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
        <button
          onClick={() => {
            if (id) {
              const request = interceptedRequests.find(
                (req) => req.id === id,
              )?.raw;
              const response = interceptedResponses.find(
                (res) => res.id === id,
              )?.raw_response;
              if (request) {
                forwardRequest(id, request);
              } else if (response) {
                forwardResponse(id, response);
              }
            }
          }}
          className={`${BTN_BASE} ${BTN_NEUTRAL}`}
        >
          Forward
          <ButtonIcon raw={forwardIconRaw} />
        </button>

        <button
          onClick={() => {
            const reqRes = interceptedRequests.map((req) => ({
              id: req.id,
              type: "request",
              raw: req.raw,
            }));
            reqRes.push(
              ...interceptedResponses.map((res) => ({
                id: res.id,
                type: "response",
                raw: res.raw_response,
              })),
            );
            forwardAll(reqRes);
          }}
          className={`${BTN_BASE} ${BTN_NEUTRAL}`}
        >
          Forward All
          <ButtonIcon raw={forwardAllIconRaw} />
        </button>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => {
            if (id) {
              dropRequest(id);
            }
          }}
          className={`${BTN_BASE} ${BTN_DANGER}`}
        >
          Drop
          <ButtonIcon raw={dropIconRaw} />
        </button>
        <button
          onClick={() => {
            dropAll([
              ...interceptedRequests.map((req) => req.id),
              ...interceptedResponses.map((res) => res.id),
            ]);
          }}
          className={`${BTN_BASE} ${BTN_DANGER}`}
        >
          Drop All
          <ButtonIcon raw={dropAllIconRaw} />
        </button>
        <button
          onClick={() => openViewer()}
          disabled={!vncUrl}
          title={
            vncUrl
              ? "Open the browser viewer in a new tab"
              : "Viewer available once the session is connected"
          }
          className={`${BTN_BASE} ${
            !vncUrl
              ? "bg-gray text-white/40 cursor-not-allowed border border-white/10"
              : viewerBlocked
                ? `${BTN_DANGER} animate-pulse`
                : BTN_NEUTRAL
          }`}
        >
          Open Browser Window
          <ButtonIcon raw={browserIconRaw} />
        </button>
      </div>
    </div>
  );
}
