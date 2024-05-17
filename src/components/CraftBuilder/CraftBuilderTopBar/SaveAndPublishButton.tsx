"use client";

import { CheckIcon, LoaderCircle, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function SaveAndPublishButton() {
  const { craft, version } = useEditCraftStore((s) => ({
    craft: s.craft,
    version: s.editingVersion,
  }));

  const mutation = useCraftMutation();
  const query = useCraftQuery(craft.id);

  const dirty =
    query.data?.craft !== craft || query.data?.editingVersion !== version;
  const isPublished = Boolean(version.publishedAt) && !dirty;

  if (craft.archivedAt !== null) {
    return null;
  }

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
