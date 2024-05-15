import { truncate } from "lodash";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActionsMenu } from "./ActionsMenu";

interface Props {
  craft: FormCraft.CraftListingItem;
}

export function CraftCard(props: Props) {
  const { craft } = props;
  return (
    <Link
      href={`/form/${craft.id}/edit`}
      className={cn(
        `bg-background shadow-sm h-56 rounded hover:shadow-xl transition duration-500 ease-in-out
         grid grid-rows-[1fr_auto_auto]
        `
      )}
    >
      <div className="flex items-start justify-center text-left break-words p-4">
        <h2 className="text-xl font-regular w-full">
          {truncate(craft.title, {
            length: 38,
            omission: "...",
          })}
        </h2>
      </div>
      <div className="relative">
        <ActionsMenu craft={craft} />
        {(craft.published || craft.submissionsCount > 0) && (
          <p className="text-xs text-slate-500 p-2 pb-4">
            {craft.submissionsCount}{" "}
            {craft.submissionsCount === 1 ? "response" : "responses"}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1 items-start flex-wrap p-2 border-t bg-accent/50">
        {craft.archived && (
          <Badge className=" bg-rose-300 text-rose-100 pointer-events-none">
            Archived
          </Badge>
        )}
        {!craft.archived && (
          <>
            {craft.published ? (
              <Badge className=" bg-emerald-500 text-emerald-900 pointer-events-none">
                Published
              </Badge>
            ) : (
              <Badge className=" bg-slate-300 text-slate-100 pointer-events-none">
                Draft
              </Badge>
            )}
            {craft.unpublishedChanges && craft.published && (
              <Badge className=" bg-amber-300 text-amber-50 pointer-events-none whitespace-nowrap">
                Unpublished changes
              </Badge>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
