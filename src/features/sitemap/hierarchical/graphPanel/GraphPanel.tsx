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
import { dumb } from "@/constant/constant";
import type { EdgeType, endPoint, NodeType } from "../../types/graphTypes";
import { createNode } from "@/utils/createNode";
import { createEdge } from "@/utils/createEdge";

//react flow node type
const nodeTypes = {
  endpointNode: Node,
};

// create empty array to store nodes and push nodes to it
const dumbNodes: NodeType[] = [];
createNode(dumb as endPoint, 0, 1, dumbNodes);

// create empty array to store edges and push edges to it
const initialEdges: EdgeType[] = [];
createEdge(dumb as endPoint, initialEdges);

export default function GraphPanel() {
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
