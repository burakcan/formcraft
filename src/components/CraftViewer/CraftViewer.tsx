/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import FontPicker from "react-fontpicker-ts";
import { defaultTheme } from "@/lib/themes/defaultTheme";
import { PageLayout } from "../CraftBuilder/PageRenderer/PageLayout";
import { ThemeStyle } from "../CraftBuilder/PageRenderer/ThemeStyle";
import { FullPageLoading } from "../FullPageLoading";
import { ResourcePreloader } from "./ResourcePreloader";
import { craftPageDefinitions } from "@/craftPages";
import { MadeWithFormCraftViewer } from "@/craftPages/pageAtoms/MadeWithFormcraft";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

export function CraftViewer() {
  const { version, rootNodeId, currentNode, currentPage, themes } =
    useViewCraftStore((s) => ({
      version: s.version,
      rootNodeId: s.rootNodeId,
      currentNode: s.getCurrentNode(),
      currentPage: s.getCurrentPage(),
      themes: s.themes,
      answers: s.answers,
    }));

  const currentPageBaseTheme = themes[currentPage.baseThemeId] || defaultTheme;
  const theme = {
    ...currentPageBaseTheme,
    ...currentPage.themeOverride,
  };

  const { fontsLoaded, imagesLoaded } = useLoadPageResources(
    currentPage,
    theme
  );

  const pageDefinition = craftPageDefinitions[currentPage.type];

  const pageDomId = "p_" + currentPage.id.replaceAll("-", "_");

  return (
    <div
      className={`
        absolute
        top-0
        left-0
        max-w-full w-full h-full
        prose prose-md
        prose-p:m-0
        prose-headings:mb-4
        prose-headings:font-bold
        overflow-hidden
  `}
    >
      <ResourcePreloader
        pages={version.data.pages}
        themes={themes}
        enabled={currentNode.id === rootNodeId && fontsLoaded && imagesLoaded}
      />
      <FullPageLoading
        visible={
          (!fontsLoaded || !imagesLoaded) && currentNode.id === rootNodeId
        }
      />
      <PageLayout theme={theme} page={currentPage}>
        <AnimatePresence initial={false}>
          <motion.div
            id={pageDomId}
            custom="up"
            className="craft-renderer w-full h-full absolute top-0 left-0"
            key={currentPage.id}
            variants={{
              initial: (direction: "up" | "down") => ({
                opacity: 0,
                y: direction === "up" ? "50%" : "-50%",
              }),
              target: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              },
              exit: (direction: "up" | "down") => ({
                opacity: 0,
                y: direction === "up" ? "-50%" : "50%",
              }),
            }}
            initial="initial"
            animate="target"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ThemeStyle theme={theme} pageId={pageDomId} />
            {"document" in global && (
              <FontPicker
                loaderOnly
                loadFonts={[theme.titleFont, theme.descriptionFont]}
                loadAllVariants
              />
            )}
            <pageDefinition.viewerComponent page={currentPage as never} />
          </motion.div>
        </AnimatePresence>
        <MadeWithFormCraftViewer theme={theme} />
      </PageLayout>
    </div>
  );
}
