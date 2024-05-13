import { useEffect, useMemo, useState } from "react";
import type { CraftTheme, ThemeImageType } from "@/craftPages/schemas/theming";

export function useLoadPageResources(
  page: FormCraft.CraftPage,
  theme: CraftTheme
) {
  const [loadedPages, setLoadedPages] = useState<string[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const fonts = useMemo(
    () => [theme.titleFont, theme.descriptionFont, "Inter"],
    [theme.titleFont, theme.descriptionFont]
  );

  const images = useMemo(
    () =>
      [theme.backgroundImage, theme.decorationImage, page.logo].filter(
        Boolean
      ) as ThemeImageType[],
    [theme.backgroundImage, theme.decorationImage, page.logo]
  );

  useEffect(() => {
    if (loadedPages.includes(page.id)) {
      return;
    }

    setFontsLoaded(false);

    if ("fonts" in document) {
      const fontPromises = fonts.map((font) =>
        document.fonts.load(`1em ${font}`)
      );

      Promise.all(fontPromises).then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, [fonts, loadedPages, page.id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (loadedPages.includes(page.id)) {
      return;
    }

    setImagesLoaded(false);

    const imagePromises = images.map((imgObject) => {
      return new Promise((resolve, reject) => {
        const src =
          imgObject?.source === "upload"
            ? `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imgObject.id}/public?auto=format,compress&w=1080`
            : imgObject?.url + "?auto=format,compress&w=1080";

        if (!src) {
          return resolve(void 0);
        }

        const image = new Image();
        image.onload = () => resolve(void 0);
        image.onerror = reject;
        image.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, [images, loadedPages, page.id]);

  useEffect(() => {
    if (loadedPages.includes(page.id)) {
      return;
    }

    if (fontsLoaded && imagesLoaded) {
      setLoadedPages((prev) => [...prev, page.id]);
    }
  }, [imagesLoaded, fontsLoaded, loadedPages, page.id]);

  return {
    fontsLoaded,
    imagesLoaded,
  };
}
