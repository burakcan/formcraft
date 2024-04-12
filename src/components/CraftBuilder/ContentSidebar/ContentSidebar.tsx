"use client";
import { PlusIcon } from "lucide-react";
import { useContext } from "react";
import { useStore } from "zustand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function ContentSidebar() {
  const ctx = useContext(EditCraftStoreContext);

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { editingVersion, selectedPageId, setSelectedPage, addPage } = store;

  const handleAddPage = () => {
    const id = Date.now().toString();

    addPage({
      _: "_bp_",
      id,
      type: "long_text",
      title: "New Page",
      description: "This is a long text page.",
      baseThemeId: "default",
      themeOverride: {},
    });

    setSelectedPage(id);
  };

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="vertical" autoSaveId="fc_content_sidebar">
        <ResizablePanel>
          <div className="flex items-center justify-between py-2 mx-2 text-sm font-medium border-b">
            Content
            <Button
              onClick={handleAddPage}
              variant="secondary"
              size="icon"
              className="size-10"
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
          <div>
            {editingVersion.data.pages.map((page) => (
              <div
                key={page.id}
                onClick={() => store.setSelectedPage(page.id)}
                className={cn("p-2 text-sm rounded m-2 cursor-default", {
                  "bg-accent": page.id === selectedPageId,
                })}
              >
                {page.title}
              </div>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex items-center justify-between py-2 mx-2 text-sm font-medium border-b">
            Endings
            <Button variant="secondary" size="icon" className="size-10">
              <PlusIcon className="size-4" />
            </Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
