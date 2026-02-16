import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReqResContent from "../reqResPanel/components/ReqResContent";
import PayloadsPanel from "./components/PayloadsPanel";
import HistoryTable from "./components/HistoryTable";

export default function Intruder() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup className="" autoSaveId="intruder" direction="horizontal">
        {/* Left Side */}
        <Panel minSize={45}>
          <PanelGroup
            className="border-red border-r"
            autoSaveId="intruder-input-panel"
            direction="vertical"
          >
            {/* Top Left Panel */}
            <Panel className="w-full pr-3 pl-14" defaultSize={50} minSize={30}>
              <ReqResContent
                requestAndResponse={false}
                type="Request Template"
                comment="(Use § for positions)"
              />
            </Panel>

            <PanelResizeHandle className="border-red border-b" />

            {/* Bottom Left Panel */}
            <Panel minSize={36}>
              <PayloadsPanel />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle />
        {/* Right Side */}
        <Panel minSize={33}>
          <PanelGroup autoSaveId="intruder-output-panel" direction="vertical">
            {/* Top Right Panel */}
            <Panel minSize={17}>
              <HistoryTable />
            </Panel>

            <PanelResizeHandle className="border-red border-b" />

            {/* Bottom Right Panel */}
            <Panel className="w-full px-3" minSize={32}>
              <ReqResContent requestAndResponse={true} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
