import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  page: FormCraft.CraftPage;
  selectedPageId: string;
  onSelect: () => void;
}

export function ContentItem(props: Props) {
  const { index, page, selectedPageId, onSelect } = props;

  return (
    <Reorder.Item
      value={page}
      as="div"
      onClick={onSelect}
      className={cn(
        "p-2 text-sm rounded m-2 cursor-default whitespace-nowrap text-ellipsis overflow-hidden",
        {
          "bg-accent": page.id === selectedPageId,
        }
      )}
    >
      <GripVertical className="inline-block mr-2 size-4 stroke-muted-foreground/50" />
      <span className=" font-medium mr-1 text-xs text-muted-foreground">
        {index + 1}.
      </span>
      <span>{page.title}</span>
    </Reorder.Item>
  );
}
