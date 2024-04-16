import { Reorder } from "framer-motion";
import { GripVertical, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  index: number;
  page: FormCraft.CraftPage;
  selectedPageId: string;
  totalItems: number;
  onSelect: () => void;
  onDelete: () => void;
}

export function ContentItem(props: Props) {
  const { index, page, selectedPageId, onSelect, onDelete, totalItems } = props;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Reorder.Item
      value={page}
      as="div"
      data-active={page.id === selectedPageId}
      onClick={onSelect}
      className={cn(
        `group p-2 text-sm rounded m-2 cursor-default
        whitespace-nowrap text-ellipsis overflow-hidden relative`,
        {
          "bg-accent": page.id === selectedPageId,
          "data-active[true]:pr-6": totalItems > 1,
          "hover:pr-6": totalItems > 1,
        }
      )}
    >
      <GripVertical className="inline-block mr-2 size-4 stroke-muted-foreground/50" />
      <span className=" font-medium mr-1 text-xs text-muted-foreground">
        {index + 1}.
      </span>
      <span>{page.title || page.description}</span>
      {totalItems > 1 && (
        <div className="absolute right-1 top-0 h-full hidden items-center group-hover:flex group-data-[active=true]:flex">
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={handleDelete}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}
    </Reorder.Item>
  );
}
