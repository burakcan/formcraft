"use client";

import { DialogContent } from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { findRootNode } from "@/lib/findRootNode";
import { CraftViewer } from "../CraftViewer";
import { Button } from "../ui/button";
import { Dialog, DialogClose } from "../ui/dialog";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { PageChangeReasonProvider } from "@/hooks/usePageChangeReason";
import { useThemes } from "@/hooks/useThemes";
import {
  ViewCraftStoreContext,
  createViewCraftStore,
} from "@/services/store/viewCraftStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CraftPreview(props: Props) {
  const { open, onOpenChange } = props;

  const themes = useThemes();
  const { craft, version } = useEditCraftStore((store) => ({
    craft: store.craft,
    version: store.editingVersion,
  }));

  const nodes = version.data.flow.nodes;
  const edges = version.data.flow.edges;
  const rootNode = findRootNode(nodes, edges);

  if (!rootNode) {
    return null;
  }

  const store =
    open &&
    createViewCraftStore({
      craft,
      version,
      themes,
      rootNodeId: rootNode.id,
      currentNodeId: rootNode.id,
      currentPageId: rootNode.data.pageId,
      variables: {},
      answers: {},
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild>
        {open && store && (
          <div className="fixed top-0 left-0 inset-0 bg-primary/50 z-30">
            <div className="absolute inset-4 bg-background rounded overflow-hidden shadow-lg grid grid-rows-[theme(spacing.8)_auto]">
              <div className="h-8 border-b bg-accent flex items-center justify-between">
                <span className="text-xs px-2">
                  <strong>Preview</strong> -{" "}
                  <span className="text-slate-500">
                    Your answers will not be saved
                  </span>
                </span>
                <DialogClose asChild>
                  <Button size="icon" variant="ghost">
                    <XIcon className="size-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="relative overflow-hidden transform-gpu">
                <PageChangeReasonProvider>
                  <ViewCraftStoreContext.Provider value={store}>
                    <CraftViewer />
                  </ViewCraftStoreContext.Provider>
                </PageChangeReasonProvider>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
