import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export interface EndPageNodeData {
  pageId: FormCraft.CraftEndPage["id"];
}

export function EndPageNode(props: NodeProps<EndPageNodeData>) {
  const { pageId } = props.data;

  const { page, index } = useEditCraftStore((s) => ({
    page: s.editingVersion.data.end_pages.find((p) => p.id === pageId),
    index: s.editingVersion.data.end_pages.findIndex((p) => p.id === pageId),
  }));

  if (!page || index === -1) {
    return null;
  }

  const pageDefinition = craftPageDefinitions.end_screen;

  return (
    <>
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
              e{index + 1}.
            </span>
            <span>{page.title || "Untitled Page"}</span>
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
