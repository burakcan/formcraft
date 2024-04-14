"use client";

import { CheckIcon, LoaderCircle, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";

export function SaveButton() {
  const mutation = useCraftMutation(false);

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => mutation.mutate()}
      disabled={!mutation.dirty}
    >
      {mutation.status === "success" && !mutation.dirty ? (
        <CheckIcon className="size-4" />
      ) : mutation.status === "pending" ? (
        <LoaderCircle className="animate-spin size-4" />
      ) : (
        <SaveIcon className="size-4" />
      )}
    </Button>
  );
}
