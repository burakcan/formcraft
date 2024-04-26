/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useMemo } from "react";
import type { Node } from "reactflow";
import { PageLayout } from "../CraftBuilder/PageRenderer/PageLayout";
import { ThemeStyle } from "../CraftBuilder/PageRenderer/ThemeStyle";
import { FullPageLoading } from "../FullPageLoading";
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

  return (
    <div
      className={`
        craft-renderer
        absolute
        top-0
        left-0
        bg-craft-background
        max-w-full w-full h-full
        prose prose-md
        prose-p:m-0
        prose-headings:mb-4
        prose-headings:font-bold
  `}
    >
      <FullPageLoading
        visible={
          (!fontsLoaded || !imagesLoaded) && currentNode.id === rootNodeId
        }
      />
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.titleFont}&display=swap`}
        rel="stylesheet"
      />
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.descriptionFont}&display=swap`}
        rel="stylesheet"
      />
      <ThemeStyle theme={theme} />
      <PageLayout theme={theme} page={currentPage}>
        {"viewerComponent" in pageDefinition && (
          <pageDefinition.viewerComponent page={currentPage as never} />
        )}
      </PageLayout>
      <MadeWithFormCraftViewer />
    </div>
  );
}
