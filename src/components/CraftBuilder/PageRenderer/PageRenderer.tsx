"use client";

import "./style.css";
import { motion } from "framer-motion";
import { PageLayout } from "./PageLayout";
import { ThemeStyle } from "./ThemeStyle";
import { craftPageDefinitions } from "@/craftPages";
import { MadeWithFormCraftEditor } from "@/craftPages/atoms/MadeWithFormcraft";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { usePageTheme } from "@/hooks/usePageTheme";

export function PageRenderer() {
  const { selectedPageId, editPage, selectedPage } = useEditCraftStore((s) => ({
    selectedPageId: s.selectedPageId,
    editPage: s.editPage,
    selectedPage: s.getSelectedPage(),
  }));

  const pageDefinition =
    selectedPage && craftPageDefinitions[selectedPage.type];
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
      key={`${theme.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageLayout theme={theme} page={selectedPage} disableTransitions>
        <ThemeStyle theme={theme} />
        <link
          href={`https://fonts.googleapis.com/css2?family=${theme.titleFont}&display=swap`}
          rel="stylesheet"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=${theme.descriptionFont}&display=swap`}
          rel="stylesheet"
        />
        <pageDefinition.editorComponent
          page={selectedPage as never}
          onChange={editPage}
        />
      </PageLayout>
      <MadeWithFormCraftEditor />
    </motion.div>
  );
}
