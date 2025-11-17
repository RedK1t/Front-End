import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainPanel from "./mainPanel/MainPanel";

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
              middle
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={20}
          maxSize={50}
          className="border-light-red overflow-y-auto! border-t"
        >
          left
        </Panel>
      </PanelGroup>
    </div>
  );
}
