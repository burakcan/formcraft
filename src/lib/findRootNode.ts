import type { Edge, Node } from "reactflow";

export function findRootNode(nodes: Node[], edges: Edge[]) {
  const edgesMap = edges.reduce((acc, edge) => {
    const source = edge.source;
    const target = edge.target;

    if (!acc[source]) {
      acc[source] = [];
    }

    if (!acc[target]) {
      acc[target] = [];
    }

    acc[source].push(target);
    acc[target].push(source);

    return acc;
  }, {} as Record<string, string[]>);

  const rootNode = nodes.find((node) => {
    const isPage = node.type === "page";
    return isPage && edgesMap[node.id]?.length === 1;
  });

  return rootNode;
}
