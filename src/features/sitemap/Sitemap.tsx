import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainPanel from "./mainPanel/MainPanel";
import SidePanel from "./sidePanel/SidePanel";
import BottomPanel from "./bottomPanel/BottomPanel";

export default function Sitemap() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <PanelGroup autoSaveId="sitemap-horizontal" direction="horizontal">
            <Panel
              className="border-light-red overflow-y-auto! border-r"
              minSize={65}
            >
              <MainPanel />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={15} className="overflow-y-auto!">
              <SidePanel />
            </Panel>
          </PanelGroup>
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
