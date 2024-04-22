"use client";

import "./style.css";
import { motion } from "framer-motion";
import FontPicker from "react-fontpicker-ts";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { MadeWithFormCraft } from "../PageAtoms/MadeWithFormCraft";
import { PageLayout } from "./PageLayout";
import { ThemeStyle } from "./ThemeStyle";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { usePageTheme } from "@/hooks/usePageTheme";

export function PageRenderer() {
  const { selectedPageId, editPage, selectedPage } = useEditCraftStore((s) => ({
    selectedPageId: s.selectedPageId,
    editPage: s.editPage,
    selectedPage: s.editingVersion.data.pages.find(
      (page) => page.id === s.selectedPageId
    ),
  }));

  const pageDefinition = selectedPage && pageDefinitions[selectedPage.type];
  const theme = usePageTheme(selectedPageId);

  if (!selectedPage || !pageDefinition) {
    return null;
  }

  return (
    <motion.div
      className={`
        craft-renderer
        relative
        bg-craft-background
        max-w-full w-full h-full
        prose prose-md
        prose-p:m-0
        prose-headings:mb-4
        prose-headings:font-bold
      `}
      style={{
        colorScheme: "dark",
      }}
      key={`${selectedPage.id}-${theme.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {"document" in global && (
        <FontPicker
          loaderOnly
          loadFonts={[theme.titleFont, theme.descriptionFont]}
          loadAllVariants
        />
      )}
      <ThemeStyle theme={theme} />
      <PageLayout theme={theme}>
        <pageDefinition.component
          page={selectedPage as never}
          onChange={editPage}
        />
      </PageLayout>
      <MadeWithFormCraft />
    </motion.div>
  );
}
