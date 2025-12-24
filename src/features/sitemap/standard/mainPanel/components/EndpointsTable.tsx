import { useDomain } from "@/context/DomainContext";
import Filters from "./Filters";
import TableRow from "./TableRow";
import useSubdomains from "@/features/Reconnaissance/hooks/useSubdomains";
import useGetEndpoints from "@/features/sitemap/hooks/useGetEndpoints";
import { useSearchParams } from "react-router-dom";

export default function EndpointsTable() {
  const { domain } = useDomain();
  const { dnsSubdomains, httpSubdomains } = useSubdomains(domain || "");
  const [searchParams] = useSearchParams();
  const folder = searchParams.get("folder") || "";
  const search = searchParams.get("search") || "";
  const method = searchParams.get("method") || "";
  const statusCode = searchParams.get("statusCode") || "";
  const source = searchParams.get("source") || "";
  const subDomains = [
    ...dnsSubdomains.map((item) => item.subdomain),
    ...httpSubdomains.map((item) => item.subdomain),
    domain || "",
  ];
  const { endpoints, flattenedEndpoints, isLoading, isError } = useGetEndpoints(
    domain || "",
    subDomains,
  );
  console.log(endpoints);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching endpoints</div>;
  }
  const filteredEndpoints = flattenedEndpoints
    .filter(
      (endpoint) =>
        endpoint.path.includes(folder) &&
        endpoint.path.includes(search) &&
        (method === "" || endpoint.method === method) &&
        (statusCode === "" || endpoint.status === +statusCode) &&
        (source === "" || endpoint.source === source),
    )
    .map((endpoint) => ({
      ...endpoint,
      path:
        endpoint.path.split("//")[1].replace(folder, "") === ""
          ? "/"
          : endpoint.path.split("//")[1].replace(folder, ""),
    }));
  return (
    <div className="text-yellowish-white flex h-full w-full flex-col gap-y-2 overflow-hidden py-2">
      <Filters />
      <div className="flex h-full w-full flex-col gap-y-2 overflow-auto">
        {filteredEndpoints.map((endpoint) =>
          endpoint.method === null ? null : (
            <TableRow key={endpoint.id} {...endpoint} />
          ),
        )}
      </div>
    </div>
  );
}
