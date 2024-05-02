"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { EmptyState } from "./EmptyState";
import { CraftCard } from "@/components/CraftListing/CraftCard";
import { CreateCraftButton } from "@/components/CreateCraftButton";
import { useCraftsListingQuery } from "@/hooks/useCraftsListingQuery";

export function CraftListing() {
  const showArchived = useSearchParams().get("showArchived") === "true";
  const { data } = useCraftsListingQuery(showArchived);
  const router = useRouter();

  const handleToggleArchived = (checked: boolean) => {
    router.replace("?showArchived=" + checked);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Your forms</h1>
        <div className="flex-auto" />
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-archived">Show archived</Label>
          <Switch
            id="show-archived"
            checked={showArchived}
            onCheckedChange={handleToggleArchived}
          />
        </div>
        <CreateCraftButton />
      </div>
      {data?.data.length === 0 && <EmptyState />}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {data?.data.map((craft) => (
          <CraftCard craft={craft} key={craft.id} />
        ))}
      </div>
    </div>
  );
}
