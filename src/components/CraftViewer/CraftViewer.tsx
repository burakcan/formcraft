/* eslint-disable @next/next/no-page-custom-font */
"use client";

import type { CraftVersion } from "@prisma/client";
import { useMemo, useState } from "react";
import { PageLayout } from "../CraftBuilder/PageRenderer/PageLayout";
import { ThemeStyle } from "../CraftBuilder/PageRenderer/ThemeStyle";
import { FullPageLoading } from "../FullPageLoading";
import { craftPageDefinitions } from "@/craftPages";
import { MadeWithFormCraftViewer } from "@/craftPages/atoms/MadeWithFormcraft";
import type { CraftTheme } from "@/craftPages/schemas/theming";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";

interface Props {
  version: CraftVersion;
  rootNodeId: string;
  themes: Record<string, CraftTheme>;
}

export function CraftViewer(props: Props) {
  const { version, rootNodeId, themes } = props;
  const [currentNodeId] = useState(rootNodeId);

  const currentNode = useMemo(() => {
    return version.data.flow.nodes.find((node) => node.id === currentNodeId);
  }, [currentNodeId, version.data.flow.nodes]);

  const currentPage = useMemo(() => {
    return version.data.pages.find(
      (page) => page.id === currentNode?.data.pageId
    );
  }, [currentNode, version.data.pages]) as FormCraft.CraftPage;

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
      <FullPageLoading visible={!fontsLoaded || !imagesLoaded} />
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
