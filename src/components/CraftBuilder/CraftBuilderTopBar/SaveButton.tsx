"use client";

import { debounce } from "lodash";
import { CheckIcon, LoaderCircle, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import {
  useEditCraftStore,
  useEditCraftStoreTemporal,
} from "@/hooks/useEditCraftStore";

export function SaveButton() {
  const futureStates = useEditCraftStoreTemporal((s) => s.futureStates);
  const { craft, version } = useEditCraftStore((s) => ({
    craft: s.craft,
    version: s.editingVersion,
  }));

  const mutation = useCraftMutation();
  const query = useCraftQuery(craft.id);

  const dirty =
    query.data?.craft !== craft || query.data?.editingVersion !== version;

  // auto save
  useEffect(() => {
    if (!dirty) {
      return;
    }

    const save = debounce(() => {
      if (mutation.status === "pending" || futureStates.length > 0) {
        return;
      }

      mutation.mutate(false);
    }, 500);

    save();

    return () => {
      save.cancel();
    };
  }, [dirty, futureStates.length, mutation]);

  return (
    <Button
      size="icon"
      variant="secondary"
      className=" disabled:bg-background disabled:border disabled:text-foreground bg-emerald-500 hover:bg-emerald-600 text-white"
      onClick={() => mutation.mutate(false)}
      disabled={!dirty}
    >
      {mutation.status === "success" && !dirty ? (
        <CheckIcon className="size-4" />
      ) : mutation.status === "pending" ? (
        <LoaderCircle className="animate-spin size-4" />
      ) : (
        <SaveIcon className="size-4" />
      )}
    </Button>
  );
}
