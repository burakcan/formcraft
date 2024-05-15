import { AnimatePresence, motion } from "framer-motion";
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  disableTransitions?: boolean;
}

export function BackgroundImage(props: Props) {
  const { reason: pageChangeReason } = usePageChangeReason();
  const { theme, disableTransitions } = props;
  const { backgroundImage } = theme;

  const bgImageKey =
    backgroundImage?.source === "upload"
      ? backgroundImage?.id
      : backgroundImage?.url || "";

  return (
    <AnimatePresence initial={false} custom={pageChangeReason}>
      {backgroundImage && (
        <motion.div
          className="size-full fixed top-0 left-0 z-0 will-change-transform"
          key={bgImageKey}
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
          <ThemeImage
            imageObject={backgroundImage}
            attributionSide={
              theme.decorationImageLayout === "left-full" ? "right" : "left"
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
