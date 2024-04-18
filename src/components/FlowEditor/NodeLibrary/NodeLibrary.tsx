"use client";

import {
  CalculatorIcon,
  GitBranchIcon,
  GitFork,
  RectangleEllipsisIcon,
  VariableIcon,
} from "lucide-react";

export function NodeLibrary() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div
        className="bg-background border rounded-md p-2 flex gap-2 items-center"
        draggable
        onDragStart={(e) => {
          onDragStart(e, "branching");
        }}
      >
        <div
          className={
            "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
          }
        >
          <GitBranchIcon className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Branching</span>
          </div>
        </div>
      </div>

      <div
        className="bg-background border rounded-md p-2 flex gap-2 items-center"
        draggable
        onDragStart={(e) => {
          onDragStart(e, "branching");
        }}
      >
        <div
          className={
            "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
          }
        >
          <GitFork className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Fork</span>
          </div>
        </div>
      </div>

      <div
        className="bg-background border rounded-md p-2 flex gap-2 items-center"
        draggable
        onDragStart={(e) => {
          onDragStart(e, "branching");
        }}
      >
        <div
          className={
            "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
          }
        >
          <CalculatorIcon className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Calculation</span>
          </div>
        </div>
      </div>

      <div
        className="bg-background border rounded-md p-2 flex gap-2 items-center"
        draggable
        onDragStart={(e) => {
          onDragStart(e, "branching");
        }}
      >
        <div
          className={
            "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
          }
        >
          <VariableIcon className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Set variable</span>
          </div>
        </div>
      </div>

      <div
        className="bg-background border rounded-md p-2 flex gap-2 items-center"
        draggable
        onDragStart={(e) => {
          onDragStart(e, "branching");
        }}
      >
        <div
          className={
            "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
          }
        >
          <RectangleEllipsisIcon className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Get variable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
