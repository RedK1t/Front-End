import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Filters from "./components/Filters";
import Table from "./components/Table/Table";
import ProxyCacheManager from "./hooks/ProxyCacheManager";
import { useSearchParams } from "react-router-dom";
import useProxyTraffic from "./hooks/useProxyTraffic";
import InterceptorBottomPanel from "./components/InterceptorBottomPanel";

export default function Interceptor() {
  const [searchParams] = useSearchParams();
  const { interceptedRequests, interceptedResponses } = useProxyTraffic();
  const selected = searchParams.get("selected");
  const selectedItemRequest = interceptedRequests.find(
    (item) => item.id === selected,
  );
  const selectedItemResponse = interceptedResponses.find(
    (item) => item.id === selected,
  );
  const request =
    selectedItemRequest?.raw || selectedItemResponse?.parent_request.raw;
  const response = selectedItemResponse?.raw_response || "";

  return (
    <div className="h-dvh w-full overflow-hidden">
      <ProxyCacheManager />
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel className="overflow-hidden">
          <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 py-2.5">
            <Filters />
            <Table />
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={17}
          maxSize={70}
          className="border-light-red overflow-y-hidden! border-t"
        >
          <InterceptorBottomPanel
            id={selected || ""}
            reqEditable={Boolean(selectedItemRequest)}
            resEditable={Boolean(selectedItemResponse)}
            requestText={request}
            responseText={response}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
