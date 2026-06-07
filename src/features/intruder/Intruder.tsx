import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReqResContent from "../reqResPanel/components/ReqResContent";
import PayloadsPanel from "./components/PayloadsPanel";
import HistoryTable from "./components/HistoryTable";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import useProxyTraffic from "../Interceptor/hooks/useProxyTraffic";

export default function Intruder() {
  const location = useLocation();
  const { intruderResponse } = useProxyTraffic();
  // Capture rawRequest from navigation state once on mount to persist it
  // even if search param updates later clear the location state.
  const [initialRawRequest] = useState(() => location.state?.rawRequest || "");
  const [rawRequest, setRawRequest] = useState(initialRawRequest);

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
                text={rawRequest}
                onChange={setRawRequest}
              />
            </Panel>

            <PanelResizeHandle className="border-red border-b" />

            {/* Bottom Left Panel */}
            <Panel minSize={36}>
              <PayloadsPanel requestTemplate={rawRequest} />
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
              <ReqResContent
                requestAndResponse={true}
                requestText={intruderResponse?.request}
                responseText={intruderResponse?.response}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
