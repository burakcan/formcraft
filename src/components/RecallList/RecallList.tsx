import type { SuggestionProps } from "@tiptap/suggestion";
import { CommandEmpty } from "cmdk";
import hotkeys from "hotkeys-js";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CommandGroup, CommandItem, Command, CommandList } from "../ui/command";
import { craftPageDefinitions } from "@/craftPages";

export interface RecallItemProps {
  recall: {
    label: string;
  };
  page: FormCraft.CraftPage;
  pageIndex: number;
  index: number;
}

function RecallItem(props: RecallItemProps) {
  const { recall, page, index, pageIndex } = props;
  const pageDefinition = craftPageDefinitions[page.type];
  const Icon = pageDefinition.icon;

  return (
    <>
      <CommandItem key={`${page.id}_${recall.label}`} value={String(index)}>
        <div className="flex items-center min-w-60 max-w-96">
          <div className={cn("mr-2 p-2 rounded", pageDefinition.iconClassName)}>
            <Icon className={cn("size-4", pageDefinition.iconClassName)} />
          </div>
          <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <span className=" font-medium mr-1 text-xs text-muted-foreground">
              {pageIndex + 1}.
            </span>
            <span>{page.title || ""}</span>
          </div>
          <Badge className="ml-1" variant="outline">
            {recall.label}
          </Badge>
        </div>
      </CommandItem>
    </>
  );
}

interface Props extends SuggestionProps {}

export const RecallList = forwardRef<HTMLDivElement, Props>(function RecallList(
  props,
  ref
) {
  const { query, editor, command } = props;
  const [selectedItem, setSelectedItem] = useState(0);
  const { pages, selectedPageId } = useEditCraftStore((s) => ({
    pages: s.editingVersion.data.pages,
    selectedPageId: s.selectedPageId,
  }));

  const selectedPageIndex = pages.findIndex((p) => p.id === selectedPageId);
  const recallablePages = pages
    .slice(0, selectedPageIndex)
    .filter((p) => "recall" in craftPageDefinitions[p.type])
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
    );

  const allRecalls = recallablePages
    .flatMap((p) => {
      const pageDefinition = craftPageDefinitions[p.type];

      if (!("recall" in pageDefinition)) {
        return [];
      }

      return pageDefinition.recall.map((recall) => ({
        page: p,
        recall,
      }));
    })
    .slice(0, 10);

  useEffect(() => {
    hotkeys.setScope("recall-list");

    return () => {
      hotkeys.deleteScope("recall-list");
    };
  }, []);

  useImperativeHandle(
    ref,
    // @ts-ignore
    () => {
      return {
        arrowDown: () => {
          setSelectedItem((prev) => (prev + 1) % allRecalls.length);
        },
        arrowUp: () => {
          setSelectedItem((prev) =>
            prev === 0 ? allRecalls.length - 1 : prev - 1
          );
        },
        enter: () => {
          const item = allRecalls[selectedItem];
          command({
            label: item.recall.label,
            pageId: item.page.id,
          });
        },
      };
    },
    [allRecalls, command, selectedItem]
  );

  useEffect(() => {
    setSelectedItem(0);
  }, [query]);

  if (!editor.isFocused) {
    return null;
  }

  return (
    <Command
      className="rounded border shadow-md"
      ref={ref}
      value={String(selectedItem)}
    >
      {allRecalls.length === 0 && (
        <CommandEmpty className="p-4 text-sm text-muted-foreground">
          No pages to recall from.
        </CommandEmpty>
      )}
      {allRecalls.length > 0 && (
        <CommandGroup heading="Recall from..." className="text-sm">
          <CommandList>
            {allRecalls.map(({ recall, page }, i) => (
              <RecallItem
                pageIndex={pages.findIndex((p) => p.id === page.id)}
                key={`${page.id}_${recall.label}`}
                page={page}
                recall={recall}
                index={i}
              />
            ))}
          </CommandList>
        </CommandGroup>
      )}
    </Command>
  );
});
