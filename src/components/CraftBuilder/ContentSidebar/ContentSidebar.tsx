"use client";

import { Reorder } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { PageLibrary } from "../PageLibrary";
import { ContentItem } from "./ContentItem";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { craftPageDefinitions } from "@/craftPages";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function ContentSidebar() {
  const [movingItem, setMovingItem] = useState<string | null>(null);
  const {
    editingVersion,
    setSelectedPage,
    removePage,
    selectedPageId,
    onReorder,
    addPage,
  } = useEditCraftStore((s) => ({
    addPage: s.addPage,
    editingVersion: s.editingVersion,
    setSelectedPage: s.setSelectedPage,
    removePage: s.removePage,
    selectedPageId: s.selectedPageId,
    onReorder: s.onReorderPages,
  }));

  const { pages, end_pages } = editingVersion.data;

  const handleReorderContent = (pages: FormCraft.CraftPage[]) => {
    if (!movingItem) return;
    onReorder(pages, movingItem);
  };

  const handleAddEnding = () => {
    const id = uuid();

    addPage(
      craftPageDefinitions.end_screen.editorSchema.parse({
        id,
        type: "end_screen",
        title: "Thank you for completing the form!",
        description: "Your responses have been submitted.",
        baseThemeId: editingVersion.data.defaultTheme,
        logo: editingVersion.data.defaultLogo,
      }),
      true
    );

    setSelectedPage(id);
  };

  const handleReorderEndings = (pages: FormCraft.CraftEndPage[]) => {
    if (!movingItem) return;
    onReorder(pages, movingItem, true);
  };

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={75} minSize={25}>
          <div className="flex-none flex items-center justify-between h-14 mx-2 text-sm font-medium border-b">
            Content
            <PageLibrary />
          </div>
          <ScrollArea className="h-[calc(100%-theme(spacing[14]))]">
            <Reorder.Group
              as="div"
              axis="y"
              values={pages}
              onReorder={handleReorderContent}
            >
              {pages.map((page, index) => (
                <ContentItem
                  key={page.id}
                  index={index}
                  page={page}
                  totalItems={pages.length}
                  selectedPageId={selectedPageId}
                  onSelect={() => setSelectedPage(page.id)}
                  onDelete={() => removePage(page.id)}
                  setMovingItem={setMovingItem}
                />
              ))}
            </Reorder.Group>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={25}>
          <div className="flex-none flex items-center justify-between h-14 mx-2 text-sm font-medium border-b">
            Endings
            <Button
              variant="secondary"
              size="icon"
              className="size-10"
              onClick={handleAddEnding}
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-theme(spacing[14]))]">
            <Reorder.Group
              as="div"
              axis="y"
              values={end_pages}
              onReorder={handleReorderEndings}
            >
              {end_pages.map((page, index) => (
                <ContentItem
                  isEnding
                  index={index}
                  key={page.id}
                  page={page}
                  totalItems={end_pages.length}
                  selectedPageId={selectedPageId}
                  setMovingItem={setMovingItem}
                  onSelect={() => setSelectedPage(page.id)}
                  onDelete={() => removePage(page.id, true)}
                />
              ))}
            </Reorder.Group>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
