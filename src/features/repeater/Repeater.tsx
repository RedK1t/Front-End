import BottomPanel from "../reqResPanel/BottomPanel";
import TabsList from "./components/TabsList";
import HeaderLeftPart from "./components/HeaderLeftPart";
import HeaderRightPart from "./components/HeaderRightPart";
import { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import type { RepeaterTab, RepeaterResponse } from "./types";

const DEFAULT_REQUEST = `GET / HTTP/1.1
Host: example.com
User-Agent: RedKit Repeater
Accept: */*

`;

const extractPathFromRequest = (rawRequest: string): string => {
  const lines = rawRequest.split("\n");
  const firstLine = lines[0]?.trim();
  if (!firstLine) return "New Tab";
  const parts = firstLine.split(" ");
  if (parts.length >= 2) {
    const path = parts[1];
    return path;
  }
  return "New Tab";
};

const createNewTab = (): RepeaterTab => ({
  id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: "/",
  request: DEFAULT_REQUEST,
  response: "",
  loading: false,
  error: null,
});

export default function Repeater() {
  const [isExtended, setIsExtended] = useState(false);
  const [tabs, setTabs] = useState<RepeaterTab[]>([createNewTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    import.meta.env.VITE_proxy_websocket_url,
    {
      shouldReconnect: () => true,
      share: true,
    },
  );

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  console.log("Repeater active tab:", activeTab);
  console.log("Repeater lastJsonMessage:", lastJsonMessage);

  const handleAddTab = useCallback(() => {
    const newTab = createNewTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabId);
      if (newTabs.length === 0) {
        const newTab = createNewTab();
        return [newTab];
      }
      return newTabs;
    });
    setActiveTabId((prev) => {
      if (prev === tabId) {
        setTabs((currentTabs) => {
          const newTabs = currentTabs.filter((tab) => tab.id !== tabId);
          if (newTabs.length > 0) {
            setActiveTabId(newTabs[0].id);
          }
          return newTabs;
        });
      }
      return prev;
    });
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const handleTabRename = useCallback((tabId: string, newName: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, name: newName } : tab)),
    );
  }, []);

  const handleRequestChange = useCallback(
    (value: string) => {
      const path = extractPathFromRequest(value);
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, request: value, name: path } : tab,
        ),
      );
    },
    [activeTabId],
  );

  const handleSendRequest = useCallback(() => {
    if (!activeTab) return;

    console.log("Sending request for tab:", activeTab.id);
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, loading: true, error: null } : tab,
      ),
    );

    sendJsonMessage({
      action: "repeater_send",
      req_id: activeTab.id,
      raw: activeTab.request,
      follow_redirects: false,
      timeout: 30,
    });
  }, [activeTab, activeTabId, sendJsonMessage]);

  useEffect(() => {
    console.log("lastJsonMessage updated:", lastJsonMessage);
    if (!lastJsonMessage) return;
    const msg = lastJsonMessage as RepeaterResponse;
    if (msg.type === "repeater_response") {
      const tabId = msg.req_id;
      console.log("Received repeater_response for tab:", tabId);
      if (!tabId) return;

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== tabId) return tab;
          console.log("Updating tab:", tabId, msg);
          if (msg.success && msg.data) {
            return {
              ...tab,
              loading: false,
              response: msg.data.raw_response,
              statusCode: msg.data.status_code,
              reason: msg.data.reason,
              elapsedTime: msg.data.elapsed_time,
              size: msg.data.size,
              error: null,
            };
          } else {
            return {
              ...tab,
              loading: false,
              error: msg.error || "Unknown error",
            };
          }
        }),
      );
    }
  }, [lastJsonMessage]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div
        className={`border-light-red transition-all duration-1000 ease-in-out ${isExtended ? "h-full" : "h-[7%]"} flex max-h-fit w-full items-center justify-between gap-1.5 border-b px-2 py-1`}
      >
        <HeaderLeftPart onSend={handleSendRequest} onAddTab={handleAddTab} />
        <TabsList
          isExtended={isExtended}
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onTabRename={handleTabRename}
        />
        <HeaderRightPart
          isExtended={isExtended}
          setIsExtended={setIsExtended}
          tabs={tabs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectTab={setActiveTabId}
        />
      </div>
      <div className="h-full">
        <BottomPanel
          editable={true}
          requestText={activeTab.request}
          responseText={
            activeTab.loading
              ? "Loading..."
              : activeTab.error
                ? `Error: ${activeTab.error}`
                : activeTab.response
          }
          onRequestChange={handleRequestChange}
        />
      </div>
    </div>
  );
}
