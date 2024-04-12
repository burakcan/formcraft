"use client";

import type { ReactNode } from "react";
import { useContext } from "react";
import { useStore } from "zustand";
import { StatementRenderer } from "./Statement";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function PageRenderer() {
  const ctx = useContext(EditCraftStoreContext);

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { editingVersion, selectedPageId, editPage } = store;
  const selectedPage = editingVersion.data.pages.find(
    (page) => page.id === selectedPageId
  );

  if (!selectedPage) {
    return null;
  }

  let rendered: ReactNode | null = null;

  switch (selectedPage.type) {
    case "statement":
      rendered = <StatementRenderer onChange={editPage} page={selectedPage} />;
      break;
    case "end_screen":
      rendered = <div>End Screen</div>;
      break;
    case "short_text":
      rendered = <div>Short Text</div>;
      break;
    case "long_text":
      rendered = <div>Long Text</div>;
      break;
    default:
      rendered = null;
      break;
  }

  return <div className="w-full h-full">{rendered}</div>;
}
