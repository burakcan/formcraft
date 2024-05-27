import { Reorder } from "framer-motion";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";

interface Props {
  index: number;
  isEnding?: boolean;
  page: FormCraft.CraftPage;
  selectedPageId: string;
  totalItems: number;
  onSelect: () => void;
  onDelete: () => void;
  setMovingItem: (id: string | null) => void;
}

export function ContentItem(props: Props) {
  const {
    index,
    isEnding,
    page,
    selectedPageId,
    onSelect,
    onDelete,
    totalItems,
    setMovingItem,
  } = props;

  const pageDefinition = craftPageDefinitions[page.type];
  const { icon: Icon, iconClassName } = pageDefinition;

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
      onPointerDown={() => {
        setMovingItem(page.id);
      }}
      onPointerUp={() => {
        setMovingItem(null);
      }}
      className={cn(
        `group p-1 text-sm rounded m-2 cursor-default
        whitespace-nowrap relative w-60 flex items-center bg-background`,
        {
          "bg-accent": page.id === selectedPageId,
          "data-[active=true]:pr-6": totalItems > 1,
          "hover:pr-6": totalItems > 1,
        }
      )}
    >
      <div
        className={cn("mr-2 p-2 rounded size-8 inline-block", iconClassName)}
      >
        <Icon className={cn("size-4", iconClassName)} />
      </div>
      <div className="overflow-hidden text-ellipsis">
        <span className="font-semibold mr-1 text-xs">
          {isEnding && "e"}
          {index + 1}.
        </span>
        <span>{page.title}</span>
      </div>
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
