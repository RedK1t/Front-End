import type {
  GraphEndPoint,
  NodeType,
} from "@/features/sitemap/types/graphTypes";

let yLevel = 2;

// x is the horizontal spacing between nodes
const x = 500;
// y is the vertical spacing between nodes
const y = 1;

export function createNode(
  element: GraphEndPoint,
  _: number,
  level: number,
  arr: NodeType[],
) {
  arr.push({
    id: `${element.path}`,
    position: { x: x * level, y: y * yLevel },
    data: {
      endpoint: `${level === 0 ? "" : "/"}${element.path.split("/").pop()}`,
      method: element.method,
    },
    type: "endpointNode",
  });
  if (element.children?.length > 0) {
    yLevel--;
    element.children.forEach((child, j) => {
      createNode(child, j, level + 1, arr);
    });
  }
  yLevel += 50;
}

export function createNodeTree(rootElement: GraphEndPoint): NodeType[] {
  const nodes: NodeType[] = [];
  yLevel = 50; // Reset yLevel to 2 before starting
  createNode(rootElement, 0, 0, nodes);
  yLevel = 50; // Reset yLevel to 2 after completion
  return nodes;
}
