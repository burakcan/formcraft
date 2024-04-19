"use client";

import "reactflow/dist/style.css";
import dagre from "@dagrejs/dagre";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LayoutGridIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Edge,
  Connection,
  ReactFlowInstance,
  Node,
  NodeChange,
  EdgeChange,
} from "reactflow";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
  ConnectionLineType,
  Position,
  Panel,
  MarkerType,
} from "reactflow";
import { v4 as uuid } from "uuid";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { RemovableEdge } from "./Edges/RemovableEdge";
import { BranchingNode } from "./Nodes/BranchingNode";
import { PageNode } from "./Nodes/PageNode";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

const nodeTypes = {
  page: PageNode,
  branching: BranchingNode,
};

const edgeTypes = {
  removable: RemovableEdge,
};

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

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export function FlowEditor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<ReactFlowInstance>();

  const { editingVersion, setFlow } = useEditCraftStore((s) => ({
    editingVersion: s.editingVersion,
    setFlow: s.setFlow,
  }));

  const initialNodes = editingVersion.data.flow.nodes;
  const initialEdges = editingVersion.data.flow.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  useEffect(() => {
    if (editorInstance) {
      setFlow(editorInstance.toObject());
    }
  }, [editorInstance, nodes, edges, setFlow]);

  const onLayout = useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
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
        id: uuid(),
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
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        onInit={setEditorInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Panel
          position="top-right"
          className="bg-background rounded-md shadow-sm"
        >
          <TooltipProvider>
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
          </TooltipProvider>
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
