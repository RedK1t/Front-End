import type { endPoint, NodeType } from "@/features/sitemap/types/graphTypes";

let yLevel = 2;

// x is the horizontal spacing between nodes
const x = 300;
// y is the vertical spacing between nodes
const y = 70;

export function createNode(
  element: endPoint,
  _: number,
  level: number,
  arr: NodeType[],
) {
  arr.push({
    id: `${element.path}`,
    position: { x: x * level, y: y * yLevel },
    data: { endpoint: element.path, method: element.method },
    type: "endpointNode",
  });
  if (element.children.length > 0) {
    yLevel++;
    element.children.forEach((child, j) => {
      createNode(child, j, level + 1, arr);
    });
  }
  yLevel--;
}
