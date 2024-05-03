/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import type { Node } from "reactflow";
import { PageLayout } from "../CraftBuilder/PageRenderer/PageLayout";
import { ThemeStyle } from "../CraftBuilder/PageRenderer/ThemeStyle";
import { FullPageLoading } from "../FullPageLoading";
import { ResourcePreloader } from "./ResourcePreloader";
import { craftPageDefinitions } from "@/craftPages";
import { MadeWithFormCraftViewer } from "@/craftPages/atoms/MadeWithFormcraft";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

export function CraftViewer() {
  const { version, rootNodeId, currentNodeId, currentPageId, themes } =
    useViewCraftStore((s) => ({
      version: s.version,
      rootNodeId: s.rootNodeId,
      currentNodeId: s.currentNodeId,
      currentPageId: s.currentPageId,
      themes: s.themes,
      answers: s.answers,
    }));

  const currentNode = useMemo(() => {
    return version.data.flow.nodes.find((node) => node.id === currentNodeId);
  }, [currentNodeId, version.data.flow.nodes]) as Node;

  const currentPage = useMemo(() => {
    return version.data.pages.find((page) => page.id === currentPageId);
  }, [currentPageId, version.data.pages]) as FormCraft.CraftPage;

  const currentPageBaseTheme = themes[currentPage.baseThemeId];
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
        craft-renderer
        absolute
        top-0
        left-0
        max-w-full w-full h-full
        prose prose-md
        prose-p:m-0
        prose-headings:mb-4
        prose-headings:font-bold
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
                y: direction === "up" ? 50 : -50,
              }),
              target: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.4,
                  ease: "easeInOut",
                },
              },
              exit: (direction: "up" | "down") => ({
                opacity: 0,
                y: direction === "up" ? -50 : 50,
              }),
            }}
            initial="initial"
            animate="target"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ThemeStyle theme={theme} pageId={pageDomId} />
            <link
              href={`https://fonts.googleapis.com/css2?family=${theme.titleFont}&display=swap`}
              rel="stylesheet"
            />
            <link
              href={`https://fonts.googleapis.com/css2?family=${theme.descriptionFont}&display=swap`}
              rel="stylesheet"
            />
            <pageDefinition.viewerComponent page={currentPage as never} />
          </motion.div>
        </AnimatePresence>
      </PageLayout>
      <MadeWithFormCraftViewer />
    </div>
  );
}
