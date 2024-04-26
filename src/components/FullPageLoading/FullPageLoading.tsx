"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarLoader } from "../BarLoader";

interface Props {
  visible: boolean;
}

export function FullPageLoading(props: Props) {
  const { visible } = props;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
          }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-background z-50"
        >
          <BarLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
