"use client";

import { CheckIcon, LoaderCircle, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftMutation } from "@/hooks/useCraftMutation";

export function SaveButton() {
  const mutation = useCraftMutation(false);

  return (
    <Button
      size="icon"
      variant="secondary"
      className=" disabled:bg-background disabled:border disabled:text-foreground bg-emerald-500 hover:bg-emerald-600 text-white"
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
