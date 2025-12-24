import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import SidePanel from "./standard/sidePanel/SidePanel";
import MainPanel from "./standard/mainPanel/MainPanel";
import { useSearchParams } from "react-router-dom";

export default function Standard() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <PanelGroup autoSaveId="sitemap-horizontal" direction="horizontal">
      <Panel
        className="border-light-red overflow-y-hidden! border-r"
        minSize={65}
      >
        <MainPanel />
      </Panel>
      <PanelResizeHandle />
      <Panel
        minSize={15}
        className="overflow-y-auto!"
        onClick={() => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete("folder");
          newSearchParams.delete("selected");
          setSearchParams(newSearchParams, { replace: true });
        }}
      >
        <SidePanel />
      </Panel>
    </PanelGroup>
  );
}
