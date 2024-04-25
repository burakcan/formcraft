"use client";
import type { CraftVersion } from "@prisma/client";
import { useMemo, useState } from "react";
import FontPicker from "react-fontpicker-ts";
import type { CraftTheme } from "@/lib/craftPageConfig/theming";
import { MadeWithFormCraft } from "../CraftBuilder/PageAtoms/MadeWithFormCraft";
import { PageWrapper } from "../CraftBuilder/PageAtoms/PageWrapper";
import { PageLayout } from "../CraftBuilder/PageRenderer/PageLayout";
import { ThemeStyle } from "../CraftBuilder/PageRenderer/ThemeStyle";

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
  }, [currentNode, version.data.pages]);

  if (!currentNode || !currentPage) {
    return null;
  }

  const currentPageBaseTheme = themes[currentPage.baseThemeId];
  const theme = {
    ...currentPageBaseTheme,
    ...currentPage.themeOverride,
  };

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
      {"document" in global && (
        <FontPicker
          loaderOnly
          loadFonts={[theme.titleFont, theme.descriptionFont]}
          loadAllVariants
        />
      )}
      <ThemeStyle theme={theme} />
      <PageLayout theme={theme} page={currentPage}>
        <PageWrapper>
          <h1 className="text-craft-title font-craft-title">
            {currentPage.title}
          </h1>
          <p className="text-craft-description font-craft-description">
            {currentPage.description}
          </p>
        </PageWrapper>
      </PageLayout>
      <MadeWithFormCraft />
    </div>
  );
}
