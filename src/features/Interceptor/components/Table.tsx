import Th from "./Th";
import { useSearchParams } from "react-router-dom";
import Tr from "./Tr";

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
const tableRows: TableRowProps[] = Array.from({ length: 20 }, () => ({
  Time: `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${Math.floor(Math.random() * 31) + 1}-${Math.floor(Math.random() * 12) + 1}-2025`,
  Type: Math.random() > 0.5 ? "HTTPS" : "HTTP",
  Method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
  Direction: Math.random() > 0.5 ? "Request" : "Response",
  Host: [
    "www.tesla.com",
    "api.example.com",
    "cdn.site.org",
    "auth.service.net",
  ][Math.floor(Math.random() * 4)],
  URL: `https://${["www.tesla.com", "api.example.com", "cdn.site.org", "auth.service.net"][Math.floor(Math.random() * 4)]}/${["endpoint", "resource", "data", "status"][Math.floor(Math.random() * 4)]}?id=${Math.floor(Math.random() * 100)}`,
  StatusCode: [200, 201, 204, 400, 401, 404, 500][
    Math.floor(Math.random() * 7)
  ],
  Length: Math.floor(Math.random() * 50000) + 100,
  Params: Math.random() > 0.5,
}));

export default function Table() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const sortedTable = tableRows.sort((a, b) => {
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
          {sortedTable.map((row, i) => (
            <Tr key={i} index={i} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
