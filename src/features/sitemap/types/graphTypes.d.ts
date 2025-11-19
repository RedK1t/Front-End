export type endPoint = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | null;
  children: endPoint[] | [];
};

export type NodeType = {
  id: string;
  position: { x: number; y: number };
  data: { endpoint: string; method: "GET" | "POST" | "PUT" | "DELETE" | null };
  type: "endpointNode";
};

export type EdgeType = {
  id: string;
  source: string;
  target: string;
};
