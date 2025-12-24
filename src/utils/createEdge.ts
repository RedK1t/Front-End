import type {
  EdgeType,
  GraphEndPoint,
} from "@/features/sitemap/types/graphTypes";

export function createEdge(child: GraphEndPoint, edges: EdgeType[]) {
  if (child.children.length > 0) {
    for (let index = 0; index < child.children.length; index++) {
      edges.push({
        id: `${child.path}-${child.children[index].path}`,
        source: `${child.path}`,
        target: `${child.children[index].path}`,
      });
    }
    child.children.forEach((child) => {
      createEdge(child as GraphEndPoint, edges);
    });
  }
}
