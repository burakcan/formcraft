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
  description: string;
}) => {
  const { onDragStart, nodeType, Icon, title, description } = props;
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
        <div className="text-xs leading-2 text-gray-500">{description}</div>
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
        nodeType="branchingV2"
        Icon={GitBranchIcon}
        title="Branching"
        description="Check multiple conditions"
      />

      <LibraryItem
        onDragStart={onDragStart}
        nodeType="andV2"
        Icon={AmpersandIcon}
        title="AND"
        description="Check if conditions are met"
      />

      <LibraryItem
        onDragStart={onDragStart}
        nodeType="orV2"
        Icon={SlashIcon}
        title="OR"
        description="Check if any condition is met"
      />
    </div>
  );
}
