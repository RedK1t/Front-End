import Th from "./Th";
import { useNavigate, useSearchParams } from "react-router-dom";
import Tr from "./Tr";
import { useEffect, useMemo, useCallback } from "react";
import useProxyTraffic from "../../hooks/useProxyTraffic";
import useProxyActions from "../../hooks/useProxyActions";

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
  } = useProxyTraffic();

  const {
    forwardRequest,
    forwardResponse,
    dropRequest,
    markForResponseIntercept,
    unmarkForResponseIntercept,
    getHistoryDetail,
  } = useProxyActions();

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
  const [searchParams, setSearchParams] = useSearchParams();
  const isHistoryMode = searchParams.get("history") === "true";

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
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [sortedTable]);

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
              handleForward={handleForward}
              handleDrop={handleDrop}
              handleToggleMark={handleToggleMark}
              navigate={navigate}
              isMarked={markedForResponseIntercept.includes(row.id)}
              {...row}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
