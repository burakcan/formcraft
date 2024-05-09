import { AnimatePresence, motion } from "framer-motion";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  disableTransitions?: boolean;
}

export function BackgroundImage(props: Props) {
  const { theme, disableTransitions } = props;
  const { backgroundImage } = theme;

  const bgImageKey =
    backgroundImage?.source === "upload"
      ? backgroundImage?.id
      : backgroundImage?.url || "";

  return (
    <AnimatePresence initial={false}>
      {backgroundImage && (
        <motion.div
          className="w-full h-full absolute top-0 left-0"
          key={bgImageKey}
          initial={!disableTransitions && { opacity: 0, y: "10%" }}
          animate={!disableTransitions && { opacity: 1, y: 0 }}
          exit={!disableTransitions ? { opacity: 0, y: "-10%" } : undefined}
          transition={{ duration: 0.4, ease: "easeInOut" }}
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
