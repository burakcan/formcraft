"use client";

import "reactflow/dist/style.css";
import { useCallback, useMemo } from "react";
import type { Node, Edge, Connection } from "reactflow";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
  ConnectionLineType,
  MarkerType,
} from "reactflow";
import { PageNode } from "./Nodes";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function FlowEditor() {
  const { editingVersion } = useEditCraftStore((s) => ({
    editingVersion: s.editingVersion,
  }));

  const [endingPages, contentPages] = editingVersion.data.pages.reduce(
    (acc, page) => {
      if (page.type === "end_screen") {
        acc[0].push(page);
      } else {
        acc[1].push(page);
      }
      return acc;
    },
    [[], []] as [FormCraft.CraftPage[], FormCraft.CraftPage[]]
  );

  const initialNodes: Node[] = useMemo(
    () =>
      [...contentPages, ...endingPages].map((page, i) => ({
        id: page.id,
        type: "page",
        position: { y: 100, x: i * 240 + 50 },
        data: { page, index: i },
      })),
    [contentPages, endingPages]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      initialNodes.map((node, i) => ({
        id: `edge-${i}`,
        source: node.id,
        sourceHandle: "output",
        target: initialNodes[i + 1]?.id,
        targetHandle: "input",
        type: ConnectionLineType.SmoothStep,
      })),
    [initialNodes]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => {
    return {
      page: PageNode,
    };
  }, []);

  return (
    <div className="flex flex-col justify-stretch items-stretch h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          style: { stroke: "#000", strokeWidth: 1 },
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#000",
          },
        }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Cross} />
      </ReactFlow>
    </div>
  );
}
