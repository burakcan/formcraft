"use client";

import { Loader2Icon, SaveIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCraftMutation } from "@/hooks/useCraftMutation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigationConfirmed: () => void;
  onNavigationCancelled: () => void;
  onDiscarded: () => void;
}

export function BlockerModal(props: Props) {
  const { open, onOpenChange, onNavigationConfirmed, onDiscarded } = props;
  const mutation = useCraftMutation();

  const handleSave = (publish: boolean) => {
    mutation.mutate(publish, {
      onSuccess: () => {
        onOpenChange(false);
        onNavigationConfirmed();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You have unsaved changes.</DialogTitle>
          <DialogDescription>
            Please save your changes before leaving. Do you want to save them
            now?
          </DialogDescription>
        </DialogHeader>
        {mutation.isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <Loader2Icon className="size-8 text-primary animate-spin" />
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onDiscarded();
            }}
          >
            Discard changes
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => handleSave(false)}
          >
            Save
            <SaveIcon className="ml-2 size-4" />
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => handleSave(true)}
          >
            Save & Publish
            <SendIcon className="ml-2 size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
