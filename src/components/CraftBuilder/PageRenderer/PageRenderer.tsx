"use client";

import "./style.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { useStore } from "zustand";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function PageRenderer() {
  const ctx = useContext(EditCraftStoreContext);

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { editingVersion, selectedPageId, editPage } = store;
  const selectedPage = editingVersion?.data.pages.find(
    (page) => page.id === selectedPageId
  );

  if (!selectedPage) {
    return null;
  }

  const pageDefinition = pageDefinitions[selectedPage.type];

  return (
    <motion.div
      className="w-full h-full"
      key={selectedPage.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <pageDefinition.component page={selectedPage} onChange={editPage} />
    </motion.div>
  );
}
