import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import Filters from "./components/Filters";
import Table from "../../components/Table/Table";

const tableRows: (string | number | boolean)[][] = Array.from(
  { length: 20 },
  () => [
    `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${Math.floor(Math.random() * 31) + 1}-${Math.floor(Math.random() * 12) + 1}-2025`,
    Math.random() > 0.5 ? "HTTPS" : "HTTP",
    ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
    Math.random() > 0.5 ? "Request" : "Response",
    ["www.tesla.com", "api.example.com", "cdn.site.org", "auth.service.net"][
      Math.floor(Math.random() * 4)
    ],
    `https://${["www.tesla.com", "api.example.com", "cdn.site.org", "auth.service.net"][Math.floor(Math.random() * 4)]}/${["endpoint", "resource", "data", "status"][Math.floor(Math.random() * 4)]}?id=${Math.floor(Math.random() * 100)}`,
    [200, 201, 204, 400, 401, 404, 500][Math.floor(Math.random() * 7)],
    Math.floor(Math.random() * 50000) + 100,
    Math.random() > 0.5,
  ],
);

export default function Interceptor() {
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
