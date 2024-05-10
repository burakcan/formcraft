"use client";

import "./style.css";
import FontPicker from "react-fontpicker-ts";
import { PageLayout } from "./PageLayout";
import { ThemeStyle } from "./ThemeStyle";
import { FullPageLoading } from "@/components/FullPageLoading";
import { craftPageDefinitions } from "@/craftPages";
import { MadeWithFormCraftEditor } from "@/craftPages/pageAtoms/MadeWithFormcraft";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";
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
  const { fontsLoaded } = useLoadPageResources(selectedPage!, theme);

  if (!selectedPage || !pageDefinition) {
    return null;
  }

  return (
    <div
      className={`
        craft-renderer
        relative
        bg-craft-background
        max-w-full w-full h-full
        prose prose-md
        prose-p:m-0
        prose-headings:mb-4
        prose-headings:font-normal
        overflow-hidden
      `}
    >
      {!fontsLoaded && (
        <div className="absolute size-full transform-gpu translate-x-0 z-50">
          <FullPageLoading visible={!fontsLoaded} />
        </div>
      )}

      <PageLayout theme={theme} page={selectedPage} disableTransitions>
        <ThemeStyle theme={theme} />
        {"document" in global && (
          <FontPicker
            loaderOnly
            loadFonts={[theme.titleFont, theme.descriptionFont]}
            loadAllVariants
          />
        )}
        <pageDefinition.editorComponent
          page={selectedPage as never}
          onChange={editPage}
        />
      </PageLayout>
      <MadeWithFormCraftEditor theme={theme} />
    </div>
  );
}
