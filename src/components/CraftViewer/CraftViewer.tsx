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
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

export function CraftViewer() {
  const { reason: pageChangeReason } = usePageChangeReason();
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
        prose-headings:font-normal
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
            custom={pageChangeReason}
            className="craft-renderer w-full h-full absolute top-0 left-0 text-craft"
            key={currentPage.id}
            variants={{
              initial: (reason: typeof pageChangeReason) => ({
                opacity: 0,
                y: {
                  prev: "-50%",
                  answer: "50%",
                  init: 0,
                }[reason],
              }),
              target: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              },
              exit: (reason: typeof pageChangeReason) => ({
                opacity: 0,
                y: {
                  prev: "50%",
                  answer: "-50%",
                  init: 0,
                }[reason],
                transition: {
                  delay: 0.1,
                  duration: 0.4,
                  ease: "easeInOut",
                },
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
