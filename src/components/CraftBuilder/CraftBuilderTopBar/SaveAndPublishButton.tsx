"use client";

import { CheckIcon, LoaderCircle, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";
import {
  useEditCraftStore,
  useEditCraftStoreTemporal,
} from "@/hooks/useEditCraftStore";

export function SaveAndPublishButton() {
  const dirty = useEditCraftStoreTemporal((s) => s.pastStates.length > 0);
  const publishedAt = useEditCraftStore(
    ({ editingVersion }) => editingVersion.publishedAt
  );

  const mutation = useCraftMutation();
  const isPublished = Boolean(publishedAt) && !dirty;

  return (
    <Button
      type="submit"
      onClick={() => mutation.mutate(true)}
      disabled={isPublished}
    >
      {isPublished ? "Published" : "Publish"}
      {isPublished ? (
        <CheckIcon className="size-4 ml-2" />
      ) : mutation.status === "pending" ? (
        <LoaderCircle className="animate-spin size-4 ml-2" />
      ) : (
        <SendIcon className="size-4 ml-2" />
      )}
    </Button>
  );
}
