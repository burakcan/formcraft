"use client";

import { Redo2Icon, Undo2Icon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [redo, undo]);

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => undo()}
        disabled={!canUndo}
      >
        <Undo2Icon className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="outline"
        onClick={() => redo()}
        disabled={!canRedo}
      >
        <Redo2Icon className="size-4" />
      </Button>
    </>
  );
}
