import { useQuery } from "@tanstack/react-query";
import type { GraphEndPoint } from "../types/graphTypes";
import { useDomain } from "@/context/DomainContext";
import { useMemo } from "react";

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
  const { selectedSubdomain } = useDomain();

  const { data, isLoading, isError } = useQuery<response>({
    queryKey: ["endpoints", selectedSubdomain],
    queryFn: async () => {
      if (!selectedSubdomain) {
        return { data: [] };
      }
      const res = await fetch(import.meta.env.VITE_endpoints_REST_url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domains: [selectedSubdomain],
        }),
      });
      const data = await res.json();
      return data;
    },
  });

  const flattened = useMemo(
    () => (data ? flatEndpoints(data.data) : []),
    [data],
  );
  const graphEndpoints = useMemo(
    () => (data ? transformToGraphType(data.data) : []),
    [data],
  );

  return {
    endpoints: data?.data,
    flattenedEndpoints: flattened,
    graphEndpoints,
    isLoading,
    isError,
  };
}
