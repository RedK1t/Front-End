import { useQuery } from "@tanstack/react-query";
import type { GraphEndPoint } from "../types/graphTypes";
import { useDomain } from "@/context/DomainContext";
import { useMemo } from "react";
import { getEndpoints, insertEndpoints } from "@/api/supabase";
import type { supabaseEndpoint } from "@/types/types";

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
  request: string;
  response: string;
  children: endpoint[];
};

export type FlatEndpoint = {
  id: string;
  lastSeen: string;
  source: string;
  status: number;
  request: string;
  response: string;
  method: string;
  path: string;
};

export function unFlattenEndpoints(flatEndpoints: FlatEndpoint[]): endpoint[] {
  if (!flatEndpoints || flatEndpoints.length === 0) {
    return [];
  }

  const filtered = flatEndpoints.filter((ep) => !ep.path.startsWith("http://"));

  const endpointMap = new Map<string, endpoint>();
  const roots: endpoint[] = [];

  const sorted = [...filtered].sort((a, b) => a.path.length - b.path.length);

  for (const flatEp of sorted) {
    const ep: endpoint = {
      id: flatEp.id,
      url: flatEp.path,
      method: flatEp.method,
      status: flatEp.status,
      source: flatEp.source,
      created_at: flatEp.lastSeen,
      request: flatEp.request || "",
      response: flatEp.response || "",
      children: [],
    };
    endpointMap.set(flatEp.path, ep);
  }

  for (const flatEp of sorted) {
    const ep = endpointMap.get(flatEp.path)!;
    const parentPath = getParentPath(flatEp.path);

    if (parentPath === null || parentPath === "") {
      roots.push(ep);
    } else {
      const parent = endpointMap.get(parentPath);
      if (parent) {
        parent.children.push(ep);
      } else {
        roots.push(ep);
      }
    }
  }

  return roots;
}

function getParentPath(path: string): string | null {
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex <= 0) {
    return null;
  }
  return path.substring(0, lastSlashIndex);
}

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
      const supabaseEndpoints = await getEndpoints(selectedSubdomain);
      if (supabaseEndpoints.length > 0) {
        const endpoints = unFlattenEndpoints(
          supabaseEndpoints.map((ep) => ({
            ...ep,
            id: ep.id!.toString(),
            lastSeen: ep.created_at!,
            status: ep.status_code,
          })),
        );
        return {
          data: endpoints,
        };
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
      const data: response = await res.json();
      const endpointsToInsert: supabaseEndpoint[] = flatEndpoints(
        data.data,
      ).map((ep) => ({
        sub_domain_name: selectedSubdomain,
        status_code: ep.status,
        method: ep.method,
        path: ep.path,
        request: ep.request,
        response: ep.response,
        source: ep.source,
      }));
      await insertEndpoints(endpointsToInsert);
      return data;
    },
  });

  const flattened = useMemo(
    () => (data ? flatEndpoints(data.data) : []),
    [data],
  );

  const sources = useMemo(
    () => [...new Set(flattened.map((ep) => ep.source))],
    [flattened],
  );
  const statuses = useMemo(
    () => [...new Set(flattened.map((ep) => ep.status))],
    [flattened],
  );
  const methods = useMemo(
    () => [...new Set(flattened.map((ep) => ep.method))],
    [flattened],
  );

  const graphEndpoints = useMemo(
    () => (data ? transformToGraphType(data.data) : []),
    [data],
  );

  return {
    endpoints: data?.data,
    flattenedEndpoints: flattened,
    sources,
    statuses,
    methods,
    graphEndpoints,
    isLoading,
    isError,
  };
}
