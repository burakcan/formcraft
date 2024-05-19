"use client";

import { useMutationState } from "@tanstack/react-query";
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

  const ownMutation = useCraftMutation();
  const query = useCraftQuery(craft.id);

  const otherMutations = useMutationState({
    filters: { mutationKey: ["craft", craft.id], status: "pending" },
  });

  const isPublishing = ownMutation.isPending;
  const isSaving = otherMutations.length > 0 && !isPublishing;
  const dirty =
    query.data?.craft !== craft || query.data?.editingVersion !== version;
  const isPublished = Boolean(version.publishedAt) && !dirty;

  if (craft.archivedAt !== null) {
    return null;
  }

  return (
    <Button
      type="submit"
      className=" w-32 justify-between"
      onClick={() => ownMutation.mutate(true)}
      disabled={isPublished || isSaving || isPublishing || dirty}
    >
      {isSaving
        ? "Saving"
        : isPublishing
        ? "Publishing"
        : isPublished
        ? "Published"
        : "Publish"}

      {isSaving || isPublishing || dirty ? (
        <LoaderCircle className="animate-spin size-4 ml-2" />
      ) : isPublished ? (
        <CheckIcon className="size-4 ml-2" />
      ) : (
        <SendIcon className="size-4 ml-2" />
      )}
    </Button>
  );
}

// {isPublished ? (
//   <CheckIcon className="size-4 ml-2" />
// ) : mutation.status === "pending" ? (
//   <LoaderCircle className="animate-spin size-4 ml-2" />
// ) : (
//   <SendIcon className="size-4 ml-2" />
// )}
