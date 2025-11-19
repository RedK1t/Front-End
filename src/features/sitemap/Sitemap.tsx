import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "./bottomPanel/BottomPanel";
import { Outlet } from "react-router-dom";

export default function Sitemap() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <Outlet />
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={17}
          maxSize={50}
          className="border-light-red overflow-y-hidden! border-t"
        >
          <BottomPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}
