"use client";

import { AlertCircleIcon } from "lucide-react";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function UnpublishedAlert() {
  const { hasUnpublishedChanges, archived } = useEditCraftStore((state) => ({
    hasUnpublishedChanges: state.craft.unpublishedChanges,
    archived: state.craft.archivedAt !== null,
  }));

  if (!hasUnpublishedChanges || !archived) return null;

  if (archived) {
    return (
      <Alert className="bg-rose-50 border-rose-500 text-rose-900 mb-4">
        <AlertCircleIcon className="size-4 stroke-rose-500" />
        <AlertTitle>This form is archived</AlertTitle>
        <AlertDescription>
          You can still edit this form and view responses, but integrations and
          shared links will not work until you unarchive.
          <br />
          You can unarchive this form from the dashboard.
        </AlertDescription>
      </Alert>
    );
  }

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
