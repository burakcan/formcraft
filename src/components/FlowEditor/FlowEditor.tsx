"use client";

import "reactflow/dist/style.css";
import { LayoutGridIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";
import type {
  Edge,
  Connection,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from "reactflow";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
  ConnectionLineType,
  Panel,
  MarkerType,
  ConnectionMode,
} from "reactflow";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { edgeTypes } from "./Edges";
import { nodeTypes } from "./Nodes";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useFlowEditorAutoLayout } from "@/hooks/useFlowEditorAutoLayout";

export function FlowEditor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<ReactFlowInstance>();

  const { nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange } =
    useEditCraftStore((s) => ({
      editingVersion: s.editingVersion,
      edges: s.editingVersion.data.flow.edges,
      nodes: s.editingVersion.data.flow.nodes,
      setEdges: s.setEdges,
      setNodes: s.setNodes,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
    }));

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: "removable", markerEnd: MarkerType.ArrowClosed },
          eds
        )
      ),
    [setEdges]
  );

  const onLayout = useFlowEditorAutoLayout(
    nodes,
    edges,
    setNodes,
    setEdges,
    editorInstance
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type || !editorInstance) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = editorInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: nanoid(5),
        type,
        position,
        data: {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [editorInstance, setNodes]
  );

  const handleNodesChange = (changes: NodeChange[]) => {
    const nextChanges = changes.filter((change) => {
      return change.type !== "select";
    });

    onNodesChange(nextChanges);
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    const nextChanges = changes.filter((change) => {
      return change.type !== "select";
    });

    onEdgesChange(nextChanges);
  };

  return (
    <div
      className="flex flex-col justify-stretch items-stretch h-full w-full"
      ref={wrapperRef}
    >
      <ReactFlow
        nodeDragThreshold={1}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={null}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        onInit={setEditorInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        connectionMode={ConnectionMode.Strict}
      >
        <Panel
          position="top-right"
          className="bg-background rounded-md shadow-sm"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="size-7"
                variant="ghost"
                onClick={() => onLayout("LR")}
              >
                <LayoutGridIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Auto Layout</TooltipContent>
          </Tooltip>
        </Panel>
        <Controls
          className="rounded-md shadow-sm overflow-hidden"
          showInteractive={false}
        />
        <Background variant={BackgroundVariant.Cross} />
      </ReactFlow>
    </div>
  );
}
