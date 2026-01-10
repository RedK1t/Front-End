import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ReactFlow,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useState, useEffect } from "react";
import { Node } from "./components/Node";
import type { EdgeType, NodeType } from "../../types/graphTypes";
import { createNodeTree } from "@/utils/createNode";
import useGetEndpoints from "../../hooks/useGetEndpoints";
import { createEdge } from "@/utils/createEdge";
import { useSearchParams } from "react-router-dom";

//react flow node type
const nodeTypes = {
  endpointNode: Node,
};

export default function GraphPanel() {
  const { graphEndpoints } = useGetEndpoints();
  const [searchParams] = useSearchParams();
  const subdomain = searchParams.get("subdomain");
  const [nodes, setNodes] = useState<NodeType[]>([]);

  const [edges, setEdges] = useState<EdgeType[]>([]);

  useEffect(() => {
    const dumbNodes: NodeType[] = [];
    const initialEdges: EdgeType[] = [];

    const endpoint = graphEndpoints.find(
      (ep) => ep.path.split("/")[2] === subdomain,
    );

    if (endpoint) {
      dumbNodes.push(...createNodeTree(endpoint));
    }

    createEdge(endpoint || graphEndpoints[0], initialEdges);

    // Batch state update to avoid cascading renders
    setNodes(dumbNodes);
    setEdges(initialEdges);
  }, [subdomain]);
  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as NodeType[]),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => applyEdgeChanges(changes, eds) as EdgeType[]),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultViewport={{ x: 100, y: 120, zoom: 1 }}
    >
      <Background />
    </ReactFlow>
  );
}
