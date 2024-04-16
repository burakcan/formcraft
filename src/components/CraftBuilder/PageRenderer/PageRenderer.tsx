"use client";

import "./style.css";
import { motion } from "framer-motion";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { pageDefinitions } from "@/lib/craftPageConfig";
import { fonts } from "@/lib/fonts";
import { defaultTheme } from "@/lib/themes/defaultTheme";
import { cn } from "@/lib/utils";
import { useBlurDataUrl } from "@/hooks/useBlurDataURL";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useThemes } from "@/hooks/useThemes";

export function PageRenderer() {
  const themes = useThemes();
  const store = useEditCraftStore();
  const [bgImageLoading, setBgImageLoading] = useState(false);
  const [mediaImageLoading, setMediaImageLoading] = useState(false);

  const { editingVersion, selectedPageId, editPage } = store;
  const selectedPage = editingVersion?.data.pages.find(
    (page) => page.id === selectedPageId
  );

  const pageDefinition = selectedPage && pageDefinitions[selectedPage.type];
  const baseTheme =
    (selectedPage && themes[selectedPage.baseThemeId]) || defaultTheme;
  const overrides = selectedPage?.themeOverride || {};
  const theme = { ...baseTheme, ...overrides };

  const bgBlurDataUrl = useBlurDataUrl(
    theme.backgroundImage?.blurHash || undefined
  );

  const mediaBlurDataUrl = useBlurDataUrl(
    selectedPage?.media?.blurHash || undefined
  );

  useEffect(() => {
    if (theme.backgroundImage?.url) {
      setBgImageLoading(true);
    }
  }, [theme.backgroundImage?.url]);

  useEffect(() => {
    if (selectedPage?.media?.url) {
      setMediaImageLoading(true);
    }
  }, [selectedPage?.media?.url]);

  if (!selectedPage || !pageDefinition) {
    return null;
  }

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
      {theme.backgroundImage?.url && (
        <Image
          suppressHydrationWarning
          onLoad={() => {
            setBgImageLoading(false);
          }}
          unoptimized
          key={theme.backgroundImage.url}
          placeholder={bgBlurDataUrl ? "blur" : undefined}
          blurDataURL={bgBlurDataUrl}
          style={{
            objectFit: "cover",
          }}
          fill
          sizes="60vw"
          src={theme.backgroundImage.url}
          alt="theme background"
        />
      )}
      {bgImageLoading && (
        <div className="absolute top-4 left-4 text-white text-xs font-semibold z-20">
          <LoaderCircleIcon className="animate-spin size-8 mb-2" />
          Loading image...
        </div>
      )}
      {theme.backgroundImage?.attribution && (
        <div className="absolute bottom-1 left-1 text-white text-xs z-20">
          Photo by{" "}
          <a
            href={theme.backgroundImage.attribution.url}
            target="_blank"
            rel="noreferrer"
            className="underline text-white"
          >
            {theme.backgroundImage.attribution.name}
          </a>{" "}
          on Unsplash
        </div>
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
        className={cn("w-full h-full relative z-10 text-craft flex gap-2", {
          ["flex-row-reverse"]: selectedPage.mediaLayout === "left-full",
        })}
        style={{
          textAlign: theme.textAlign,
        }}
      >
        <div
          className={cn("flex-none", {
            "w-1/2": selectedPage.media,
            "w-full": !selectedPage.media,
          })}
        >
          <pageDefinition.component
            page={selectedPage as never}
            onChange={editPage}
          />
        </div>
        {selectedPage.media && (
          <div className="relative not-prose overflow-hidden w-1/2 flex-none">
            <Image
              suppressHydrationWarning
              onLoad={() => {
                setMediaImageLoading(false);
              }}
              src={selectedPage.media.url}
              alt="Page media"
              unoptimized
              key={selectedPage.media.url}
              placeholder={bgBlurDataUrl ? "blur" : undefined}
              blurDataURL={mediaBlurDataUrl}
              style={{
                objectFit: "cover",
              }}
              fill
              sizes="60vw"
            />
            {mediaImageLoading && (
              <div className="absolute top-4 left-4 text-white text-xs font-semibold z-20">
                <LoaderCircleIcon className="animate-spin size-8 mb-2" />
                Loading image...
              </div>
            )}
            {selectedPage.media?.attribution && (
              <div className="absolute bottom-1 right-1 text-white text-xs z-20">
                Photo by{" "}
                <a
                  href={selectedPage.media.attribution.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-white"
                >
                  {selectedPage.media.attribution.name}
                </a>{" "}
                on Unsplash
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
