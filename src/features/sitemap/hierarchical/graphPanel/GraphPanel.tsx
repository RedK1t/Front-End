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
import { createNodeTree } from "@/utils/createNode";
import useGetEndpoints from "../../hooks/useGetEndpoints";
import { createEdge } from "@/utils/createEdge";
import type { EdgeType, NodeType } from "../../types/graphTypes";

//react flow node type
const nodeTypes = {
  endpointNode: Node,
};

export default function GraphPanel() {
  const { graphEndpoints } = useGetEndpoints();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);

  useEffect(() => {
    const endpoint = graphEndpoints[0];
    const initialEdges: EdgeType[] = [];
    const initialNodes: NodeType[] = endpoint ? createNodeTree(endpoint) : [];

    if (endpoint) {
      createEdge(endpoint, initialEdges);
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [graphEndpoints]);

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
