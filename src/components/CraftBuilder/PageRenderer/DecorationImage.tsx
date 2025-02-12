import { AnimatePresence, motion } from "motion/react";
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  disableTransitions?: boolean;
  theme: CraftTheme;
  layout: "left-full" | "right-full";
  noLoading?: boolean;
}

export function DecorationImage(props: Props) {
  const { reason: pageChangeReason } = usePageChangeReason();
  const { theme, layout, disableTransitions, noLoading } = props;
  const { decorationImage } = theme;

  const decoImageKey =
    decorationImage?.source === "upload"
      ? decorationImage?.id
      : decorationImage?.url || "";

  return (
    <div className="flex-none relative size-full">
      <AnimatePresence initial={false} custom={pageChangeReason}>
        <motion.div
          className="w-full h-full absolute top-0 left-0 will-change-transform"
          key={decoImageKey}
          custom={pageChangeReason}
          variants={{
            initial: (reason: typeof pageChangeReason) => {
              return {
                y: {
                  prev: "-10%",
                  answer: "10%",
                  init: 0,
                }[reason],
                opacity: 0,
              };
            },
            target: {
              y: 0,
              opacity: 1,
            },
            exit: (reason: typeof pageChangeReason) => {
              return {
                y: {
                  prev: "10%",
                  answer: "-10%",
                  init: 0,
                }[reason],
                opacity: 0,
              };
            },
          }}
          transition={{ duration: 0.5 }}
          initial={disableTransitions ? undefined : "initial"}
          animate={disableTransitions ? undefined : "target"}
          exit={disableTransitions ? undefined : "exit"}
        >
          {decorationImage && (
            <ThemeImage
              noLoading={noLoading}
              imageObject={decorationImage}
              attributionSide={layout === "left-full" ? "left" : "right"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
