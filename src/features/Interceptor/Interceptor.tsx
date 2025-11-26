import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import SwitchButton from "@/components/SwitchButton";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import interceptorOffIcon from "@/assets/interceptorOffIcon.svg";
import forwardIcon from "@/assets/forwardIcon.svg";
import forwardAllIcon from "@/assets/forwardAllIcon.svg";
import dropIcon from "@/assets/closedTrashCanIcon.svg";
import dropAllIcon from "@/assets/openTrashCanIcon.svg";
import httpHistoryIcon from "@/assets/HttpHistoryIcon.svg";
import browserIcon from "@/assets/browserIcon.svg";

export default function Interceptor() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 py-2.5">
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
                <SwitchButton
                  param="forward"
                  imgTransform={285}
                  textTransform={40}
                  buttonClassName="w-28"
                  onIcon={forwardIcon}
                  offIcon={forwardAllIcon}
                  onText="Forward"
                  offText="Forward All"
                />
                <SwitchButton
                  param="drop"
                  imgTransform={225}
                  textTransform={50}
                  buttonClassName="w-24"
                  onIcon={dropIcon}
                  offIcon={dropAllIcon}
                  onText="Drop"
                  offText="Drop All"
                />
              </div>
              <div className="flex items-center gap-x-1">
                <button
                  className={`bg-gray small-text text-yellowish-white rounded-6px flex w-32 cursor-pointer items-center justify-between px-3 py-2`}
                >
                  Open Browser
                  <img
                    src={browserIcon}
                    alt="browserIcon"
                    className="h-4 w-4"
                  />
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
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={17}
          maxSize={70}
          className="border-light-red overflow-y-hidden! border-t"
        >
          <BottomPanel editable={true} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
