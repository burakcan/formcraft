import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  children: ReactNode;
  page: FormCraft.CraftPage;
}

export function PageLayout(props: Props) {
  const { children, theme, page } = props;
  const { logo } = page;

  return (
    <div
      className={cn(
        "w-full h-full absolute top-0 left-0 z-10 text-craft flex",
        {
          ["flex-row-reverse"]: theme.decorationImageLayout === "left-full",
          "text-center": theme.textAlign === "center",
          "text-left": theme.textAlign === "left",
          "text-right": theme.textAlign === "right",
        }
      )}
    >
      <div
        className={cn("flex-none relative", {
          "w-2/3": theme.decorationImage,
          "w-full": !theme.decorationImage,
        })}
      >
        {theme.backgroundImage && (
          <ThemeImage
            imageObject={theme.backgroundImage}
            attributionSide={
              theme.decorationImageLayout === "left-full" ? "right" : "left"
            }
          />
        )}
        <div className="absolute top-0 left-0 size-full">{children}</div>
      </div>

      {theme.decorationImage && (
        <div className="flex-none relative w-1/3">
          <ThemeImage
            imageObject={theme.decorationImage}
            attributionSide={
              theme.decorationImageLayout === "left-full" ? "left" : "right"
            }
          />
        </div>
      )}

      {logo && (
        <div className="w-16 h-16 absolute top-4 left-4">
          <ThemeImage
            imageObject={logo}
            noAttribution
            objectFit="contain"
            noLoading
          />
        </div>
      )}
    </div>
  );
}
