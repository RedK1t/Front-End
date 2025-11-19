import type { EdgeType, endPoint } from "@/features/sitemap/types/graphTypes";

export function createEdge(child: endPoint, edges: EdgeType[]) {
  if (child.children.length > 0) {
    for (let index = 0; index < child.children.length; index++) {
      edges.push({
        id: `${child.path}-${child.children[index].path}`,
        source: `${child.path}`,
        target: `${child.children[index].path}`,
      });
    }
    child.children.forEach((child) => {
      createEdge(child as endPoint, edges);
    });
  }
}
