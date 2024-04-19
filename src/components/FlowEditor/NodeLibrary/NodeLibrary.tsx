"use client";

import type { LucideIcon } from "lucide-react";
import { AmpersandIcon, GitBranchIcon, SlashIcon } from "lucide-react";

const LibraryItem = (props: {
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => void;
  nodeType: string;
  Icon: LucideIcon;
  title: string;
}) => {
  const { onDragStart, nodeType, Icon, title } = props;
  return (
    <div
      className="bg-background border rounded-md p-2 flex gap-2 items-center"
      draggable
      onDragStart={(e) => {
        onDragStart(e, nodeType);
      }}
    >
      <div
        className={
          "size-8 flex-none rounded flex items-center justify-center bg-black text-white"
        }
      >
        <Icon className="size-4" />
      </div>
      <div className="overflow-hidden text-ellipsis flex-auto">
        <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

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
      <LibraryItem
        onDragStart={onDragStart}
        nodeType="branching"
        Icon={GitBranchIcon}
        title="Branching"
      />

      <LibraryItem
        onDragStart={onDragStart}
        nodeType="and"
        Icon={AmpersandIcon}
        title="AND"
      />

      <LibraryItem
        onDragStart={onDragStart}
        nodeType="or"
        Icon={SlashIcon}
        title="OR"
      />
    </div>
  );
}
