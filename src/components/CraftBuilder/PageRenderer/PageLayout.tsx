import type { ReactNode } from "react";
import type { CraftTheme } from "@/lib/craftPageConfig/theming";
import { cn } from "@/lib/utils";
import { ThemeImage } from "./ThemeImage";

interface Props {
  theme: CraftTheme;
  children: ReactNode;
}

export function PageLayout(props: Props) {
  const { children, theme } = props;

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
          "w-2/3": theme.decorationImage?.url,
          "w-full": !theme.decorationImage?.url,
        })}
      >
        {theme.backgroundImage?.url && (
          <ThemeImage
            url={theme.backgroundImage.url}
            blurHash={theme.backgroundImage.blurHash}
            attribution={theme.backgroundImage.attribution}
            attributionSide={
              theme.decorationImageLayout === "left-full" ? "right" : "left"
            }
          />
        )}
        <div className="absolute top-0 left-0 size-full">{children}</div>
      </div>

      {theme.decorationImage?.url && (
        <div className="flex-none relative w-1/3">
          <ThemeImage
            url={theme.decorationImage.url}
            blurHash={theme.decorationImage.blurHash}
            attribution={theme.decorationImage.attribution}
            attributionSide={
              theme.decorationImageLayout === "left-full" ? "left" : "right"
            }
          />
        </div>
      )}
    </div>
  );
}
