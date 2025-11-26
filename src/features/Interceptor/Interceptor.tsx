import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import Filters from "./components/Filters";
import Th from "./components/Th";
import Tr from "./components/Tr";
import Td from "./components/Td";

export default function Interceptor() {
  return (
    <div className="h-dvh w-full">
      <PanelGroup autoSaveId="sitemap" direction="vertical">
        <Panel>
          <div className="mx-auto flex h-full w-11/12 flex-col gap-2.5 py-2.5">
            <Filters />
            <table>
              <thead className="small-text text-yellowish-white">
                <tr className="bg-yellowish-white/15">
                  <Th left={true}>Time</Th>
                  <Th>Type</Th>
                  <Th>Method</Th>
                  <Th>Direction</Th>
                  <Th>Host</Th>
                  <Th>URL</Th>
                  <Th>Status Code</Th>
                  <Th>Length</Th>
                  <Th right={true}>Params</Th>
                </tr>
              </thead>
              <tbody>
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={0}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={1}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={2}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={3}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={4}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
                <Tr
                  Time="08:50:50 24-11-2025"
                  index={5}
                  Type="HTTPS"
                  Method="GET"
                  Direction="Request"
                  Host="www.tesla.com"
                  URL="https://location-services-prd.tesla.com/geoip/city?id=2"
                  StatusCode={200}
                  Length={20234}
                  Params={true}
                />
              </tbody>
            </table>
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
