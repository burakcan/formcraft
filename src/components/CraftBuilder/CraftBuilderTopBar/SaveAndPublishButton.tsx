"use client";

import { CheckIcon, LoaderCircle, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";
import { useUseEditCraftStore } from "@/hooks/useEditCraftStore";

export function SaveAndPublishButton() {
  const { editingVersion, dirty } = useUseEditCraftStore()(
    ({ editingVersion, dirty }) => ({
      dirty,
      editingVersion,
    })
  );

  const mutation = useCraftMutation(true);

  const isPublished = Boolean(editingVersion?.publishedAt) && !dirty;

  return (
    <Button
      type="submit"
      onClick={() => mutation.mutate()}
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
