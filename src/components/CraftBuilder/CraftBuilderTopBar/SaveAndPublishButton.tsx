"use client";

import { isEqual } from "lodash";
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

  const isPublishing = ownMutation.isPending;
  const dirty =
    !isEqual(query.data?.craft, craft) ||
    !isEqual(query.data?.editingVersion, version);

  const isPublished = Boolean(version.publishedAt) && !dirty;

  if (craft.archivedAt !== null) {
    return null;
  }

  return (
    <Button
      type="submit"
      className=" w-32 justify-between"
      onClick={() => ownMutation.mutate(true)}
      disabled={isPublished || isPublishing || dirty}
    >
      {isPublishing ? "Publishing" : isPublished ? "Published" : "Publish"}

      {isPublishing ? (
        <LoaderCircle className="animate-spin size-4 ml-2" />
      ) : isPublished ? (
        <CheckIcon className="size-4 ml-2" />
      ) : (
        <SendIcon className="size-4 ml-2" />
      )}
    </Button>
  );
}
