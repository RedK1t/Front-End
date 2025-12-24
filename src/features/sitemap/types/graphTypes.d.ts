export type GraphEndPoint = {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | null;
  children: GraphEndPoint[] | [];
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
