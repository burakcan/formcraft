"use client";
import {
  CopyIcon,
  EllipsisVerticalIcon,
  Loader2Icon,
  TextCursorInput,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { FaTrashRestore } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameCraftModal } from "@/components/RenameCraftModal";
import { useUnarchiveCraftMutation } from "@/hooks/useUnarchiveCraftMutation";
import { ArchiveCraftModal } from "../../ArchiveCraftModal";
import { useDuplicateCraftMutation } from "@/hooks/useDuplicateCraftMutation";

interface Props {
  craft: FormCraft.CraftListingItem;
}

export function ActionsMenu(props: Props) {
  const { craft } = props;
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const unarchiveMutation = useUnarchiveCraftMutation();
  const duplicateMutation = useDuplicateCraftMutation();

  return (
    <>
      {showArchiveModal && (
        <ArchiveCraftModal
          open={showArchiveModal}
          onOpenChange={setShowArchiveModal}
          craft={craft}
        />
      )}
      {showRenameModal && (
        <RenameCraftModal
          open={showRenameModal}
          onOpenChange={setShowRenameModal}
          data={{ id: craft.id, title: craft.title }}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="size-8 absolute bottom-2 right-2 z-10"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {unarchiveMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <EllipsisVerticalIcon className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <DropdownMenuItem onSelect={() => setShowRenameModal(true)}>
            <TextCursorInput className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => duplicateMutation.mutate(craft.id)}>
            <CopyIcon className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!craft.archived ? (
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setShowArchiveModal(true)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => unarchiveMutation.mutate(craft.id)}
            >
              <FaTrashRestore className="mr-2 h-4 w-4" />
              <span>Unarchive</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
