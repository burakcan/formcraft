"use client";

import hotkeys from "hotkeys-js";
import { Redo2Icon, Undo2Icon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditCraftStoreTemporal } from "@/hooks/useEditCraftStore";

export function UndoRedo() {
  const { undo, redo, canUndo, canRedo } = useEditCraftStoreTemporal((s) => {
    return {
      undo: s.undo,
      redo: s.redo,
      canUndo: s.pastStates.length > 0,
      canRedo: s.futureStates.length > 0,
    };
  });

  useEffect(() => {
    hotkeys.setScope("craft-builder");

    hotkeys("ctrl+z,cmd+z", "craft-builder", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      undo();
    });

    hotkeys("ctrl+shift+z,cmd+shift+z", "craft-builder", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      redo();
    });

    return () => {
      hotkeys.deleteScope("craft-builder");
    };
  }, [redo, undo]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={() => undo()}
            disabled={!canUndo}
          >
            <Undo2Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={() => redo()}
            disabled={!canRedo}
          >
            <Redo2Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </>
  );
}
