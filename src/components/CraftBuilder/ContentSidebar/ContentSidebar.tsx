"use client";

import { Reorder } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useContext } from "react";
import { useStore } from "zustand";
import { PageLibrary } from "../PageLibrary";
import { ContentItem } from "./ContentItem";
import { SidebarSection } from "./SidebarSection";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function ContentSidebar() {
  const ctx = useContext(EditCraftStoreContext);

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { editingVersion, selectedPageId, onReorder } = store;

  const [endingPages, contentPages] = editingVersion.data.pages.reduce(
    (acc, page) => {
      if (page.type === "end_screen") {
        acc[0].push(page);
      } else {
        acc[1].push(page);
      }
      return acc;
    },
    [[], []] as [FormCraft.CraftPage[], FormCraft.CraftPage[]]
  );

  const handleReorderContent = (pages: FormCraft.CraftPage[]) => {
    onReorder([...pages, ...endingPages]);
  };

  const handleReorderEndings = (pages: FormCraft.CraftPage[]) => {
    onReorder([...contentPages, ...pages]);
  };

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
                selectedPageId={selectedPageId}
                onSelect={() => store.setSelectedPage(page.id)}
              />
            ))}
          </Reorder.Group>
        </SidebarSection>
        <ResizableHandle withHandle />
        <SidebarSection
          title={
            <>
              Endings
              <Button variant="secondary" size="icon" className="size-10">
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
                index={index}
                key={page.id}
                page={page}
                selectedPageId={selectedPageId}
                onSelect={() => store.setSelectedPage(page.id)}
              />
            ))}
          </Reorder.Group>
        </SidebarSection>
      </ResizablePanelGroup>
    </div>
  );
}
