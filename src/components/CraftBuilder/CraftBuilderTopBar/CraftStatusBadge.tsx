"use client";

import { Badge } from "@/components/ui/badge";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function CraftStatusBadge() {
  const { published, unpublishedChanges, archived } = useEditCraftStore(
    (s) => ({
      published: s.craft.published,
      archived: s.craft.archivedAt !== null,
      unpublishedChanges: s.craft.unpublishedChanges,
    })
  );

  return (
    <div className="flex gap-2">
      {archived && (
        <Badge className=" bg-rose-300 text-rose-100 pointer-events-none">
          Archived
        </Badge>
      )}
      {!archived && (
        <>
          {published && unpublishedChanges && (
            <Badge className=" bg-amber-300 text-amber-50 pointer-events-none whitespace-nowrap">
              Unpublished changes
            </Badge>
          )}

          {!published && (
            <Badge className=" bg-slate-300 text-slate-100 pointer-events-none">
              Draft
            </Badge>
          )}
        </>
      )}
    </div>
  );
}
