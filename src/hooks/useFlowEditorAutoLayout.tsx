import dagre from "@dagrejs/dagre";
import { produce } from "immer";
import { useCallback } from "react";
import type { Instance, ReactFlowInstance } from "reactflow";
import { Position, type Edge, type Node } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 256;
const nodeHeight = 140;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 120,
    ranker: "tight-tree",
  });

  nodes.forEach((node) => {
    const domElement = document.querySelector(
      `.react-flow__node[data-id="${node.id}"]`
    );
    const width = domElement?.clientWidth || nodeWidth;
    const height = domElement?.clientHeight || nodeHeight;

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = produce(nodes, (draft) => {
    draft.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });
  });

  return { nodes: newNodes, edges };
};

export function useFlowEditorAutoLayout<NodeData, EdgeData>(
  nodes: Node[],
  edges: Edge[],
  setNodes: Instance.SetNodes<NodeData>,
  setEdges: Instance.SetEdges<EdgeData>,
  editorInstance?: ReactFlowInstance<NodeData, EdgeData>
) {
  return useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      if (editorInstance) {
        requestAnimationFrame(() => {
          editorInstance.fitView({
            padding: 0.1,
            maxZoom: 1,
          });
        });
      }
    },
    [nodes, edges, setNodes, setEdges, editorInstance]
  );
}
