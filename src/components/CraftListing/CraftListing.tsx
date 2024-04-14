"use client";

import { CraftCard } from "@/components/CraftCard";
import { CreateCraftButton } from "@/components/CreateCraftButton";
import { useCraftsListingQuery } from "@/hooks/useCraftsListingQuery";

export function CraftListing() {
  const { data } = useCraftsListingQuery();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your forms</h1>
        <CreateCraftButton />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {data?.data.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </div>
  );
}
