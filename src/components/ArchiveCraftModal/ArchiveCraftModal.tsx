import { CheckIcon, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArchiveCraftMutation } from "@/hooks/useArchiveCraftMutation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  craft: FormCraft.CraftListingItem;
}

export function ArchiveCraftModal(props: Props) {
  const { open, onOpenChange, craft } = props;
  const mutation = useArchiveCraftMutation();

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    mutation.mutate(craft.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Archive Form</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive <strong>{craft.title}</strong>?
            <br />
            This will remove it from the list of forms and submissions will no
            longer be accepted. You can always restore it later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            variant="ghost"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            type="submit"
            variant="destructive"
            onClick={handleConfirm}
          >
            Archive
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin size-4 ml-2" />
            ) : (
              <CheckIcon className="ml-2 size-4" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
