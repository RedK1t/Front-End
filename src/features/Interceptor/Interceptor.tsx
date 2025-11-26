import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BottomPanel from "../reqResPanel/BottomPanel";
import Filters from "./components/Filters";
import Th from "./components/Th";
import Tr from "./components/Tr";

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
                  Time="08:50:51 24-11-2025"
                  index={1}
                  Type="HTTPS"
                  Method="POST"
                  Direction="Response"
                  Host="api.github.com"
                  URL="https://api.github.com/repos/owner/repo/issues"
                  StatusCode={201}
                  Length={5120}
                  Params={false}
                />
                <Tr
                  Time="08:50:52 24-11-2025"
                  index={2}
                  Type="HTTP"
                  Method="PUT"
                  Direction="Request"
                  Host="jsonplaceholder.typicode.com"
                  URL="https://jsonplaceholder.typicode.com/posts/1"
                  StatusCode={200}
                  Length={892}
                  Params={true}
                />
                <Tr
                  Time="08:50:53 24-11-2025"
                  index={3}
                  Type="HTTPS"
                  Method="DELETE"
                  Direction="Response"
                  Host="api.twitter.com"
                  URL="https://api.twitter.com/2/tweets/1234567890"
                  StatusCode={204}
                  Length={0}
                  Params={false}
                />
                <Tr
                  Time="08:50:54 24-11-2025"
                  index={4}
                  Type="WS"
                  Method="GET"
                  Direction="Request"
                  Host="ws.postman-echo.com"
                  URL="wss://ws.postman-echo.com/raw"
                  StatusCode={101}
                  Length={42}
                  Params={true}
                />
                <Tr
                  Time="08:50:55 24-11-2025"
                  index={5}
                  Type="HTTPS"
                  Method="PATCH"
                  Direction="Response"
                  Host="api.spotify.com"
                  URL="https://api.spotify.com/v1/me/player/play"
                  StatusCode={204}
                  Length={0}
                  Params={false}
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
