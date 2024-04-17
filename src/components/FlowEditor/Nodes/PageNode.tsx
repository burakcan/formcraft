import { Handle, Position } from "reactflow";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { cn } from "@/lib/utils";

interface Props {
  data: {
    index: number;
    page: FormCraft.CraftPage;
  };
}

export function PageNode(props: Props) {
  const { page, index } = props.data;
  const pageDefinition = pageDefinitions[page.type];

  return (
    <>
      <Handle type="source" id="input" position={Position.Right} />
      <Handle type="target" id="output" position={Position.Left} />
      <div className="w-48 bg-background shadow-md rounded-md p-2 flex gap-2 items-center">
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
