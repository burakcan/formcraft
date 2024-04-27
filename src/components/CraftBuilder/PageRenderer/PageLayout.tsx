import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BackgroundImage } from "./BackgroundImage";
import { DecorationImage } from "./DecorationImage";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  disableTransitions?: boolean;
  theme: CraftTheme;
  children: ReactNode;
  page: FormCraft.CraftPage;
}

export function PageLayout(props: Props) {
  const { children, theme, disableTransitions, page } = props;
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
        className={cn(
          "flex-none relative transition-colors duration-500 bg-craft-background",
          {
            "w-2/3": theme.decorationImage,
            "w-full": !theme.decorationImage,
          }
        )}
      >
        <BackgroundImage
          theme={theme}
          disableTransitions={disableTransitions}
        />
        <div className="absolute top-0 left-0 size-full">{children}</div>
      </div>

      {theme.decorationImage && (
        <DecorationImage
          disableTransitions={disableTransitions}
          theme={theme}
          layout="left-full"
        />
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
