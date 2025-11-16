import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainPanel from "./mainPanel/MainPanel";

export default function Sitemap() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <PanelGroup autoSaveId="sitemap-horizontal" direction="horizontal">
            <Panel className="border-light-red border" minSize={65}>
              <MainPanel />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={15} className="border-light-red border">
              middle
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} maxSize={50} className="border-light-red border">
          left
        </Panel>
      </PanelGroup>
    </div>
  );
}
