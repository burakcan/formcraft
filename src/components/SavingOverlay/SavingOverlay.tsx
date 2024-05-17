import { useMutationState } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";

export function SavingOverlay() {
  const { craftId } = useEditCraftStore((s) => ({ craftId: s.craft.id }));

  const [pendingMutation] = useMutationState({
    filters: { mutationKey: ["craft", craftId], status: "pending" },
  });

  return null;

  return (
    <AnimatePresence>
      {Boolean(pendingMutation) && (
        <motion.div
          className={cn("fixed inset-0 z-50")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 z-50 bg-background opacity-70 top-14" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
