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

  const isRootNodeLoading =
    (!fontsLoaded || !imagesLoaded) && currentNode.id === rootNodeId;

  return (
    <div
      className={`
          fixed
          max-w-full
          max-h-full
          size-full
          top-0
          left-0
          overflow-hidden
          prose prose-md
          prose-p:m-0
          prose-headings:mb-4
          prose-headings:font-normal
          z-30
      `}
    >
      <FullPageLoading visible={isRootNodeLoading} />
      <ResourcePreloader
        pages={version.data.pages}
        themes={themes}
        enabled={!isRootNodeLoading}
      />
      <PageLayout theme={theme} page={currentPage}>
        <AnimatePresence initial={false} custom={pageChangeReason}>
          <motion.div
            key={currentPage.id}
            id={currentPage.id.replaceAll("-", "_")}
            custom={pageChangeReason}
            className="fixed top-0 left-0 size-full craft-renderer will-change-transform"
            variants={{
              initial: (reason: typeof pageChangeReason) => {
                return {
                  y: {
                    prev: "-100%",
                    answer: "100%",
                    init: 0,
                  }[reason],
                  opacity: 0,
                };
              },
              target: {
                y: 0,
                opacity: 1,
              },
              exit: (reason: typeof pageChangeReason) => {
                return {
                  y: {
                    prev: "100%",
                    answer: "-100%",
                    init: 0,
                  }[reason],
                  opacity: 0,
                };
              },
            }}
            transition={{ duration: 0.5 }}
            initial="initial"
            animate="target"
            exit="exit"
          >
            <ThemeStyle
              theme={theme}
              pageId={currentPage.id.replaceAll("-", "_")}
            />
            {"document" in global && (
              <FontPicker
                loaderOnly
                loadFonts={[theme.titleFont, theme.descriptionFont]}
                loadAllVariants
              />
            )}
            <pageDefinition.viewerComponent
              key={currentPage.id}
              page={currentPage as never}
            />
          </motion.div>
        </AnimatePresence>
      </PageLayout>
      <MadeWithFormCraftViewer theme={theme} />
    </div>
  );
}
