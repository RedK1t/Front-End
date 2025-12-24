import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ReactFlow,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { Node } from "./components/Node";
import type { EdgeType, NodeType } from "../../types/graphTypes";
import { createNodeTree } from "@/utils/createNode";
import { useDomain } from "@/context/DomainContext";
import useGetEndpoints from "../../hooks/useGetEndpoints";
import { createEdge } from "@/utils/createEdge";

//react flow node type
const nodeTypes = {
  endpointNode: Node,
};

// create empty array to store nodes and push nodes to it

// create empty array to store edges and push edges to it

export default function GraphPanel() {
  const { domain } = useDomain();
  const { graphEndpoints } = useGetEndpoints(domain || "");
  const dumbNodes: NodeType[] = [];
  graphEndpoints.forEach((ep) => dumbNodes.push(...createNodeTree(ep)));

  const initialEdges: EdgeType[] = [];
  createEdge(graphEndpoints[0], initialEdges);

  const [nodes, setNodes] = useState(dumbNodes);
  const [edges, setEdges] = useState(initialEdges);
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
      defaultViewport={{ x: 250, y: 300, zoom: 0 }}
    >
      <Background />
    </ReactFlow>
  );
}
