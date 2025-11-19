import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import SidePanel from "./standard/sidePanel/SidePanel";
import MainPanel from "./standard/mainPanel/MainPanel";

export default function Standard() {
  return (
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
  );
}
