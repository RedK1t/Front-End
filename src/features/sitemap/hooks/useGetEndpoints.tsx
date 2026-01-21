import { useQuery } from "@tanstack/react-query";
import type { GraphEndPoint } from "../types/graphTypes";
import useSubdomains from "@/features/Reconnaissance/hooks/useSubdomains";
import { useDomain } from "@/context/DomainContext";

type response = {
  data: endpoint[];
};
export type endpoint = {
  id: string;
  url: string;
  method: string;
  status: number;
  source: string;
  created_at: string;
  request?: string;
  response?: string;
  children: endpoint[];
};

export type FlatEndpoint = {
  id: string;
  lastSeen: string;
  source: string;
  status: number;
  request?: string;
  response?: string;
  method: string;
  path: string;
};

function flatEndpoints(endpoints: endpoint[]): FlatEndpoint[] {
  const list: FlatEndpoint[] = [];

  function recurse(eps: endpoint[]) {
    eps?.forEach((ep) => {
      list.push({
        id: ep.id,
        lastSeen: ep.created_at,
        source: ep.source,
        status: ep.status,
        method: ep.method,
        request: ep?.request || "",
        response: ep?.response || "",
        path: ep.url,
      });
      if (ep.children !== undefined && ep.children.length > 0) {
        recurse(ep.children);
      }
    });
  }

  recurse(endpoints);
  return list;
}

export function transformToGraphType(endpoints: endpoint[]): GraphEndPoint[] {
  return endpoints?.map((ep) => ({
    id: ep.id,
    path: ep.url,
    method: ep.method as "GET" | "POST" | "PUT" | "DELETE" | null,
    children: ep.children ? transformToGraphType(ep.children) : [],
  }));
}
export default function useGetEndpoints() {
  const { domain } = useDomain();
  const Subdomains = useSubdomains();
  const allSubdomains = [domain];
  Subdomains.httpSubdomains.forEach((subdomain) => {
    allSubdomains.push(subdomain.subdomain);
  });
  Subdomains.dnsSubdomains.forEach((subdomain) => {
    allSubdomains.push(subdomain.subdomain);
  });
  console.log(domain);
  console.log(allSubdomains);

  const { data, isLoading, isError } = useQuery<response>({
    queryKey: ["endpoints", domain],
    queryFn: async () => {
      if (!domain) {
        return { data: [] };
      }
      const res = await fetch(import.meta.env.VITE_endpoints_REST_url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domains: allSubdomains,
        }),
      });
      const data = await res.json();
      return data;
    },
  });

  const flattened = data ? flatEndpoints(data.data) : [];
  const graphEndpoints = data ? transformToGraphType(data.data) : [];

  return {
    endpoints: data?.data,
    flattenedEndpoints: flattened,
    graphEndpoints,
    isLoading,
    isError,
  };
}
