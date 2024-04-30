"use client";

import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function UnpublishedAlert() {
  const hasUnpublishedChanges = useEditCraftStore(
    (state) => state.craft.unpublishedChanges
  );

  if (!hasUnpublishedChanges) return null;

  return (
    <Alert className="bg-amber-50 border-amber-500 text-amber-900 mb-4">
      <AlertCircleIcon className="size-4 stroke-amber-500" />
      <AlertTitle>You have unpublished changes</AlertTitle>
      <AlertDescription>
        Integrations and shared links will not reflect these changes until you
        publish your changes.
      </AlertDescription>
    </Alert>
  );
}
