import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useBreakpoint } from "@/hooks/useTailwindBreakpoints";
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
  const { decorationImage } = theme;
  const isDesktop = useBreakpoint("sm");

  return (
    <div
      className={cn("fixed size-full top-0 left-0 z-10 text-craft", {
        "text-center": theme.textAlign === "center",
        "text-left": theme.textAlign === "left",
        "text-right": theme.textAlign === "right",
      })}
    >
      <BackgroundImage theme={theme} disableTransitions={disableTransitions} />
      <AnimatePresence initial={false}>
        {decorationImage && (
          <motion.div
            className={cn(
              "fixed w-full h-1/4 sm:w-1/3 sm:h-full top-0 z-10 will-change-transform",
              {
                "sm:left-0": theme.decorationImageLayout === "left-full",
                "sm:right-0": theme.decorationImageLayout === "right-full",
              }
            )}
            custom={theme.decorationImageLayout}
            key={theme.decorationImageLayout}
            variants={{
              initial: (layout: string) => {
                return {
                  y: !isDesktop ? "-100%" : undefined,
                  x: !isDesktop
                    ? undefined
                    : layout === "left-full"
                    ? "-100%"
                    : "100%",
                  opacity: 0,
                };
              },
              target: {
                y: !isDesktop ? 0 : undefined,
                x: 0,
                opacity: 1,
              },
              exit: (layout: string) => {
                return {
                  y: !isDesktop ? "-100%" : undefined,
                  x: !isDesktop
                    ? undefined
                    : layout === "left-full"
                    ? "-100%"
                    : "100%",
                  opacity: 0,
                };
              },
            }}
            transition={{ duration: 0.5 }}
            initial={disableTransitions ? undefined : "initial"}
            animate={disableTransitions ? undefined : "target"}
            exit={disableTransitions ? undefined : "exit"}
          >
            <DecorationImage
              disableTransitions={disableTransitions}
              theme={theme}
              layout="left-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={cn("fixed z-40 overflow-hidden transform-gpu", {
          "transition-all duration-500": !disableTransitions,
          "top-1/4 sm:top-0 h-3/4 sm:h-full w-full sm:w-2/3": decorationImage,
          "top-0 left-0 w-full h-full": !decorationImage,

          "sm:left-1/3":
            decorationImage && theme.decorationImageLayout === "left-full",
          "left-0":
            !decorationImage || theme.decorationImageLayout === "right-full",
        })}
      >
        {children}
      </div>
      {logo && (
        <div className="w-16 h-16 fixed top-4 left-4 z-20">
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
