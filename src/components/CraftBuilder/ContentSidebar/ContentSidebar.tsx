"use client";

import { Reorder } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { splitContentAndEnding } from "@/lib/utils";
import { PageLibrary } from "../PageLibrary";
import { ContentItem } from "./ContentItem";
import { SidebarSection } from "./SidebarSection";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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

  const handleReorderEndings = (pages: FormCraft.CraftPage[]) => {
    onReorder([...contentPages, ...pages]);
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

  // console.log("pages", editingVersion.data.pages);

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="vertical" autoSaveId="fc_content_sidebar">
        <SidebarSection
          title={
            <>
              Content
              <PageLibrary />
            </>
          }
          minSize={25}
          defaultSize={75}
        >
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
        </SidebarSection>
        <ResizableHandle withHandle />
        <SidebarSection
          title={
            <>
              Endings
              <Button
                variant="secondary"
                size="icon"
                className="size-10"
                onClick={handleAddEnding}
              >
                <PlusIcon className="size-4" />
              </Button>
            </>
          }
          minSize={25}
          defaultSize={25}
        >
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
        </SidebarSection>
      </ResizablePanelGroup>
    </div>
  );
}
