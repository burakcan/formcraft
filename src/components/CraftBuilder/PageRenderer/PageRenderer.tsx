"use client";

import "./style.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { fonts } from "@/lib/fonts";
import { defaultTheme } from "@/lib/themes/defaultTheme";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useThemes } from "@/hooks/useThemes";

export function PageRenderer() {
  const themes = useThemes();
  const store = useEditCraftStore();

  const { editingVersion, selectedPageId, editPage } = store;
  const selectedPage = editingVersion?.data.pages.find(
    (page) => page.id === selectedPageId
  );

  if (!selectedPage) {
    return null;
  }

  const pageDefinition = pageDefinitions[selectedPage.type];
  const baseTheme = themes[selectedPage.baseThemeId] || defaultTheme;
  const overrides = selectedPage.themeOverride || {};
  const theme = { ...baseTheme, ...overrides };

  return (
    <motion.div
      className={`
      craft-renderer
      relative
      bg-craft-background
      ${fonts[theme.font].font.variable}
      max-w-full w-full h-full
      prose prose-sm 
      prose-p:m-0
      prose-headings:mb-4
      prose-headings:font-bold`}
      key={`${selectedPage.id}-${theme.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {theme.backgroundImageUrl && (
        <Image
          style={{
            objectFit: "cover",
          }}
          fill
          sizes="60vw"
          src={theme.backgroundImageUrl}
          alt="theme background"
        />
      )}
      <div
        className="hidden"
        dangerouslySetInnerHTML={{
          __html: `
          <style>
            .craft-renderer {
              --craft-background: ${theme.backgroundColor};
              --craft-title: ${theme.titleColor};
              --craft-description: ${theme.descriptionColor};
              --craft-answers: ${theme.answersColor};
              --craft-button: ${theme.buttonColor};
              --craft-button-text: ${theme.buttonTextColor};
              --craft-font-size: ${
                theme.fontSize === "small"
                  ? "0.75rem"
                  : theme.fontSize === "medium"
                  ? "1rem"
                  : "1.25rem"
              };
              --craft-text-align: ${theme.textAlign};
            }
          </style>
        `,
        }}
      ></div>
      <div
        className="w-full h-full relative z-10 text-craft"
        style={{
          textAlign: theme.textAlign,
        }}
      >
        <pageDefinition.component
          page={selectedPage as never}
          onChange={editPage}
        />
      </div>
    </motion.div>
  );
}
