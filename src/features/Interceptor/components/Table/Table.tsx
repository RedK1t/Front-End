import Th from "./Th";
import { useSearchParams } from "react-router-dom";
import Tr from "./Tr";
import { useEffect } from "react";
import useProxyTraffic from "../../hooks/useProxyTraffic";

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
  const { interceptedRequests, interceptedResponses } = useProxyTraffic();
  const tableRows = interceptedRequests.map((item) => ({
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
  tableRows.push(
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
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");
  const filteredTable = tableRows.filter((row) => {
    return Object.values(row).some((value) =>
      String(value)
        .toLowerCase()
        .includes(search?.toLowerCase() || ""),
    );
  });
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("length", String(filteredTable.length));
    setSearchParams(newSearchParams, { replace: true });
  }, [filteredTable.length, searchParams, setSearchParams]);
  const sortedTable = filteredTable.sort((a, b) => {
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
            <Tr key={row.id} index={index} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
