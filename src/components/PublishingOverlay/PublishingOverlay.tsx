import { useMutationState } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";

export function PublishingOverlay() {
  const { craftId } = useEditCraftStore((s) => ({ craftId: s.craft.id }));

  const mutations = useMutationState({
    filters: { mutationKey: ["craft", craftId], status: "pending" },
  });

  // pendingMutation.variables is the variables that were passed to the mutation
  // in this case it's the publish boolean

  const isPublishing = mutations.some(
    (mutation) => mutation.variables === true
  );

  return (
    <AnimatePresence>
      {isPublishing && (
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
