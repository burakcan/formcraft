"use client";

import { Reorder } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { splitContentAndEnding } from "@/lib/utils";
import { PageLibrary } from "../PageLibrary";
import { ContentItem } from "./ContentItem";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function ContentSidebar() {
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
    onReorder: s.onReorder,
  }));

  const { endingPages, contentPages } = splitContentAndEnding(
    editingVersion.data.pages
  );

  const handleReorderContent = (pages: FormCraft.CraftPage[]) => {
    onReorder([...pages, ...endingPages]);
  };

  const handleAddEnding = () => {
    const id = uuid();

    addPage(
      pageDefinitions.end_screen.schema.parse({
        id,
        type: "end_screen",
        title: "Thank you for completing the form!",
        description: "Your responses have been submitted.",
      })
    );

    setSelectedPage(id);
  };

  const handleReorderEndings = (pages: FormCraft.CraftPage[]) => {
    onReorder([...contentPages, ...pages]);
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
              values={contentPages}
              onReorder={handleReorderContent}
            >
              {contentPages.map((page, index) => (
                <ContentItem
                  key={page.id}
                  index={index}
                  page={page}
                  totalItems={contentPages.length}
                  selectedPageId={selectedPageId}
                  onSelect={() => setSelectedPage(page.id)}
                  onDelete={() => removePage(page.id)}
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
              values={endingPages}
              onReorder={handleReorderEndings}
            >
              {endingPages.map((page, index) => (
                <ContentItem
                  isEnding
                  index={index}
                  key={page.id}
                  page={page}
                  totalItems={endingPages.length}
                  selectedPageId={selectedPageId}
                  onSelect={() => setSelectedPage(page.id)}
                  onDelete={() => removePage(page.id)}
                />
              ))}
            </Reorder.Group>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
