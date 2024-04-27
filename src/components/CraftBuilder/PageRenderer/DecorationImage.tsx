import { AnimatePresence, motion } from "framer-motion";
import { ThemeImage } from "./ThemeImage";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  disableTransitions?: boolean;
  theme: CraftTheme;
  layout: "left-full" | "right-full";
}

export function DecorationImage(props: Props) {
  const { theme, layout, disableTransitions } = props;
  const { decorationImage } = theme;

  const decoImageKey =
    decorationImage?.source === "upload"
      ? decorationImage?.id
      : decorationImage?.url || "";

  return (
    <div className="flex-none relative w-1/3">
      <AnimatePresence initial={false}>
        <motion.div
          className="w-full h-full absolute top-0 left-0"
          key={decoImageKey}
          initial={!disableTransitions && { opacity: 0, y: 300 }}
          animate={!disableTransitions && { opacity: 1, y: 0 }}
          exit={!disableTransitions ? { opacity: 0, y: -300 } : undefined}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {decorationImage && (
            <ThemeImage
              imageObject={decorationImage}
              attributionSide={layout === "left-full" ? "left" : "right"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
