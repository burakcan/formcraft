import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { SingleConnectionHandle } from "../Handles";
import { craftPageDefinitions } from "@/craftPages";

export interface PageNodeData {
  pageId: FormCraft.CraftPage["id"];
}

export function PageNode(props: NodeProps<PageNodeData>) {
  const { pageId } = props.data;

  const { page, index } = useEditCraftStore((s) => ({
    page: s.editingVersion.data.pages.find((p) => p.id === pageId),
    index: s.editingVersion.data.pages.findIndex((p) => p.id === pageId),
  }));

  if (!page || index === -1) {
    return null;
  }

  const pageDefinition = craftPageDefinitions[page.type];

  return (
    <>
      <SingleConnectionHandle
        type="source"
        id="output"
        position={Position.Right}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
      <Handle
        type="target"
        id="input"
        position={Position.Left}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
      <div
        className={cn(
          "w-48 bg-background shadow-md rounded-md p-2 flex gap-2 items-center"
        )}
      >
        <div
          className={cn(
            "size-8 flex-none rounded flex items-center justify-center",
            pageDefinition.iconClassName
          )}
        >
          <pageDefinition.icon className="size-4" />
        </div>
        <div className="overflow-hidden text-ellipsis flex-auto">
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span className=" font-medium mr-1 text-xs text-muted-foreground">
              {index + 1}.
            </span>
            <span>{page.title || ""}</span>
          </div>
          {page.description ? (
            <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              <span>{page.description}</span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
