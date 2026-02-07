import Filters from "./Filters";
import TableRow from "./TableRow";
import useGetEndpoints from "@/features/sitemap/hooks/useGetEndpoints";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export default function EndpointsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const folder = searchParams.get("folder") || "";
  const search = searchParams.get("search") || "";
  const method = searchParams.get("method") || "";
  const statusCode = searchParams.get("statusCode") || "";
  const source = searchParams.get("source") || "";
  const selected = searchParams.get("selected");

  function handleSelect(id: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", id);
    setSearchParams(newSearchParams, { replace: true });
  }

  const { flattenedEndpoints, isLoading, isError } = useGetEndpoints();

  const filteredEndpoints = useMemo(() => {
    if (!flattenedEndpoints) {
      return [];
    }
    return flattenedEndpoints
      .filter(
        (endpoint) =>
          endpoint.path.includes(folder) &&
          endpoint.path.includes(search) &&
          (method === "" || endpoint.method === method) &&
          (statusCode === "" || String(endpoint.status) === statusCode) &&
          (source === "" || endpoint.source === source),
      )
      .map((endpoint) => ({
        ...endpoint,
        path: endpoint.path.split("/").slice(3).join("/") || "/",
      }));
  }, [flattenedEndpoints, folder, method, search, source, statusCode]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching endpoints</div>;
  }
  return (
    <div className="text-yellowish-white flex h-full w-full flex-col gap-y-2 overflow-hidden py-2">
      <Filters />
      <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
        {filteredEndpoints.map((endpoint) =>
          endpoint.method === null ? null : (
            <TableRow
              key={endpoint.id}
              {...endpoint}
              selected={selected === endpoint.id}
              onClick={handleSelect}
            />
          ),
        )}
      </div>
    </div>
  );
}
