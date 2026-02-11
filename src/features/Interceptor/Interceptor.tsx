import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import Filters from "./components/Filters";
import Table from "../../components/Table/Table";
import useProxyTraffic from "./hooks/useProxyTraffic";

export default function Interceptor() {
  const { interceptedRequests, interceptedResponses } = useProxyTraffic();
  const tableRows = [...interceptedRequests, ...interceptedResponses].map(
    (item) => [item.type, item.method, item.url, item.host, item.url],
  );
  return (
    <div className="h-dvh w-full overflow-hidden">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel className="overflow-hidden">
          <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 py-2.5">
            <Filters />
            <Table
              data={tableRows}
              headers={[
                "Time",
                "Type",
                "Method",
                "Direction",
                "Host",
                "URL",
                "StatusCode",
                "Length",
                "Params",
              ]}
            />
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel
          minSize={17}
          maxSize={70}
          className="border-light-red overflow-y-hidden! border-t"
        >
          <BottomPanel editable={true} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
