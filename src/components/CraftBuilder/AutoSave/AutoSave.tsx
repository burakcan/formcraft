"use client";

import { motion } from "motion/react";
import { debounce, isEqual } from "lodash";
import { CheckCircle2Icon } from "lucide-react";
import { useEffect } from "react";
import { useCraftMutation } from "@/hooks/useCraftMutation";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function AutoSave() {
  const { craft, version } = useEditCraftStore((s) => ({
    craft: s.craft,
    version: s.editingVersion,
  }));

  const mutation = useCraftMutation();
  const handleSave = mutation.mutate;
  const query = useCraftQuery(craft.id);

  const dirty =
    !isEqual(query.data?.craft, craft) ||
    !isEqual(query.data?.editingVersion, version);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const save = debounce(() => {
      handleSave(false);
    }, 2000);

    save();

    return () => {
      save.cancel();
    };
  }, [dirty, handleSave]);

  const isPending = dirty || mutation.isPending;

  return (
    <>
      {isPending ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
          key="saving"
        >
          <div className="text-xs text-gray-400 flex items-center gap-1">
            Saving...
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
          key="saved"
        >
          <div className="text-xs text-gray-400 flex items-center gap-1">
            Saved
            <CheckCircle2Icon className="size-4 inline-block text-emerald-500" />
          </div>
        </motion.div>
      )}
    </>
  );
}
