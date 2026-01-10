import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import { Outlet, useSearchParams } from "react-router-dom";
import useGetEndpoints from "./hooks/useGetEndpoints";

export default function Sitemap() {
  const [searchParams] = useSearchParams();
  const selectedEndpoint = searchParams.get("selected") || "";
  const { flattenedEndpoints } = useGetEndpoints();
  const selectedEndpointData = flattenedEndpoints.find(
    (endpoint) => endpoint.id === selectedEndpoint,
  );
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <Outlet />
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={17}
          maxSize={70}
          className="border-light-red overflow-y-hidden! border-t"
        >
          <BottomPanel
            editable={false}
            requestText={selectedEndpointData?.request}
            responseText={selectedEndpointData?.response}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
