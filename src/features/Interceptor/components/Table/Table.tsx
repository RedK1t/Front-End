import Th from "./Th";
import { useNavigate, useSearchParams } from "react-router-dom";
import Tr from "./Tr";
import type { ContextRow } from "./Tr";
import { useEffect, useMemo, useCallback, useState } from "react";
import useProxyTraffic from "../../hooks/useProxyTraffic";
import useProxyActions from "../../hooks/useProxyActions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";

type TableRowProps = {
  Time: string;
  Type: string;
  Method: string;
  Direction: string;
  Host: string;
  URL: string;
  StatusCode: number;
  Length: number;
  Params: boolean;
};

export default function Table() {
  const navigate = useNavigate();

  const {
    interceptedRequests,
    interceptedResponses,
    markedForResponseIntercept,
    history,
    historyDetail,
  } = useProxyTraffic();

  const {
    forwardRequest,
    forwardResponse,
    dropRequest,
    markForResponseIntercept,
    unmarkForResponseIntercept,
    getHistoryDetail,
  } = useProxyActions();

  const [searchParams, setSearchParams] = useSearchParams();
  const isHistoryMode = searchParams.get("history") === "true";

  // The row last right-clicked. The single shared context menu (below) acts on this,
  // set synchronously by Tr's onContextMenu so it can't lag behind the async `selected`.
  const [contextRow, setContextRow] = useState<ContextRow | null>(null);

  const handleForward = useCallback(
    (id: string, direction: string) => {
      if (direction === "Request") {
        const request = interceptedRequests.find((req) => req.id === id);
        if (request?.id && request?.raw) {
          forwardRequest(request.id, request.raw);
        }
      } else {
        const response = interceptedResponses.find((res) => res.id === id);
        if (response?.id && response?.raw_response) {
          forwardResponse(response.id, response.raw_response);
        }
      }
    },
    [
      interceptedRequests,
      interceptedResponses,
      forwardRequest,
      forwardResponse,
    ],
  );

  const handleDrop = useCallback(
    (id: string) => {
      dropRequest(id);
    },
    [dropRequest],
  );

  const handleToggleMark = useCallback(
    (id: string, isMarked: boolean) => {
      if (isMarked) {
        unmarkForResponseIntercept(id);
      } else {
        markForResponseIntercept(id);
      }
    },
    [markForResponseIntercept, unmarkForResponseIntercept],
  );

  // Quick Scan: send the FULL captured raw request to the AI scanner so POST body
  // params (and any method) get tested. Falls back to URL-only when raw isn't available
  // (e.g. history rows, whose body isn't loaded at right-click time).
  const handleQuickScan = useCallback(
    (id: string, url: string) => {
      const request = interceptedRequests.find((req) => req.id === id);
      if (request?.raw) {
        navigate("/AiScanner", {
          state: { rawRequest: request.raw, url: request.url },
        });
      } else {
        navigate(`/AiScanner?url=${url}`);
      }
    },
    [interceptedRequests, navigate],
  );

  // Build a raw HTTP request string for a row (live request or history detail).
  // Returns null when the needed data isn't available yet.
  const buildRawRequest = useCallback(
    (id: string): string | null => {
      if (isHistoryMode) {
        const item = history.find((h) => h.id === id);
        if (item && historyDetail) {
          let u;
          try {
            u = new URL(item.URL);
          } catch {
            return null;
          }
          const pathQuery = (u.pathname || "/") + (u.search || "");
          let raw = `${item.Method} ${pathQuery} HTTP/1.1\n`;
          raw += historyDetail.request_headers;
          if (!historyDetail.request_headers.toLowerCase().includes("host:")) {
            raw += `Host: ${item.Host}\n`;
          }
          raw += `\n${historyDetail.request_body}`;
          return raw;
        }
        return null;
      }
      const request = interceptedRequests.find((req) => req.id === id);
      return request?.raw ?? null;
    },
    [isHistoryMode, history, historyDetail, interceptedRequests],
  );

  const handleSendToIntruder = useCallback(
    (id: string) => {
      const raw = buildRawRequest(id);
      if (raw) navigate("/proxy/intruder", { state: { rawRequest: raw } });
    },
    [buildRawRequest, navigate],
  );

  const tableRows = useMemo(() => {
    if (isHistoryMode) {
      return history;
    }

    const rows = interceptedRequests.map((item) => ({
      id: item.id,
      Time: item.Time,
      Type: item.url.split("://")[0].toUpperCase(),
      Method: item.method,
      Direction: "Request",
      Host: item.host,
      URL: item.url,
      StatusCode: 0,
      Params: item.url.includes("?"),
      headers: item.headers,
      body: item.body,
      Length: item.raw.length,
    }));
    rows.push(
      ...interceptedResponses.map((item) => ({
        id: item.id,
        Time: item.Time,
        Type: item.url.split("://")[0].toUpperCase(),
        Method: item.method,
        Direction: "Response",
        Host: item.host,
        URL: item.url,
        StatusCode: item.status_code,
        Length: item.raw_response.length,
        Params: item.url.includes("?"),
        headers: item.response_headers,
        body: item.response_body,
      })),
    );
    return rows;
  }, [isHistoryMode, history, interceptedRequests, interceptedResponses]);

  const sort = searchParams.get("sort");
  const search = searchParams.get("search");
  const Selected = searchParams.get("selected");
  const filteredTable = tableRows.filter((row) => {
    return Object.values(row).some((value) =>
      String(value)
        .toLowerCase()
        .includes(search?.toLowerCase() || ""),
    );
  });
  // Was Meant For Http History
  // useEffect(() => {
  //   const newSearchParams = new URLSearchParams(searchParams);
  //   newSearchParams.set("length", String(filteredTable.length));
  //   setSearchParams(newSearchParams, { replace: true });
  // }, [filteredTable.length, searchParams, setSearchParams]);

  const sortedTable = useMemo(() => {
    const table = [...filteredTable].sort((a, b) => {
      if (sort) {
        const key = sort.split("-")[0] as keyof TableRowProps;
        const aVal = a[key];
        const bVal = b[key];
        const order = sort.includes("asc") ? 1 : -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * order;
        }
        return String(aVal).localeCompare(String(bVal)) * order;
      }
      return 0;
    });
    return table;
  }, [filteredTable, sort]);

  useEffect(() => {
    if (sortedTable.length === 0) return;
    const selectedRow = sortedTable.find((row) => row?.id === Selected);
    if (!selectedRow) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("selected", sortedTable[0]?.id || "");
      const timeoutId = setTimeout(() => {
        setSearchParams(newSearchParams, { replace: true });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [sortedTable, Selected, searchParams, setSearchParams]);

  useEffect(() => {
    if (isHistoryMode && Selected) {
      getHistoryDetail(Selected);
    }
  }, [Selected, isHistoryMode, getHistoryDetail]);

  const handleSelect = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("selected", id);
          return newParams;
        },
        { replace: true },
      );
      if (isHistoryMode) {
        getHistoryDetail(id);
      }
    },
    [setSearchParams, isHistoryMode, getHistoryDetail],
  );

  return (
    <div className="overflow-auto">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <table className="w-full">
            <thead className="small-text text-yellowish-white bg-yellowish-white/15">
              <tr>
                <Th left={true}>Time</Th>
                <Th>Type</Th>
                <Th>Method</Th>
                <Th>Direction</Th>
                <Th>Host</Th>
                <Th>URL</Th>
                <Th>StatusCode</Th>
                <Th>Length</Th>
                <Th right={true}>Params</Th>
              </tr>
            </thead>
            <tbody>
              {sortedTable.map((row, index) => (
                <Tr
                  key={row.id}
                  index={index}
                  isSelected={row.id === Selected}
                  handleSelect={handleSelect}
                  onContextRow={setContextRow}
                  isMarked={markedForResponseIntercept.includes(row.id)}
                  {...row}
                />
              ))}
            </tbody>
          </table>
        </ContextMenuTrigger>

        {/* Single shared right-click menu — acts on the last right-clicked row.
            One menu instance instead of one per row keeps the DOM light. */}
        {contextRow && (
          <ContextMenuContent className="bg-gray rounded-6px! small-text! text-yellowish-white! z-50! border-0! drop-shadow-lg drop-shadow-black/50">
            <ContextMenuItemStyled>{contextRow.URL}</ContextMenuItemStyled>
            <div className="bg-yellowish-white! h-px! w-full" />
            {contextRow.Direction !== "History" && (
              <>
                <ContextMenuItemStyled
                  onClick={() =>
                    handleForward(contextRow.id, contextRow.Direction)
                  }
                >
                  Forward
                </ContextMenuItemStyled>
                <ContextMenuItemStyled onClick={() => handleDrop(contextRow.id)}>
                  Drop
                </ContextMenuItemStyled>
                <div className="bg-yellowish-white! h-[0.5px]! w-full" />
              </>
            )}
            <ContextMenuItemStyled
              onClick={() => handleQuickScan(contextRow.id, contextRow.URL)}
            >
              Do Quick Scan
            </ContextMenuItemStyled>
            {contextRow.Direction === "Request" && (
              <>
                <div className="bg-yellowish-white! h-px! w-full" />
                <ContextMenuItemStyled
                  onClick={() =>
                    handleToggleMark(contextRow.id, contextRow.isMarked)
                  }
                >
                  {contextRow.isMarked ? "Unmark" : "Mark"} Intercept it’s Response
                </ContextMenuItemStyled>
              </>
            )}
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled
              onClick={() => handleSendToIntruder(contextRow.id)}
            >
              Send to Intruder
            </ContextMenuItemStyled>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
