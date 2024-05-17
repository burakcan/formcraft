"use client";

import { debounce } from "lodash";
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
    query.data?.craft !== craft || query.data?.editingVersion !== version;

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const save = debounce(() => {
      handleSave(false);
    }, 1000);

    save();

    return () => {
      save.cancel();
    };
  }, [dirty, handleSave]);

  return null;
}
