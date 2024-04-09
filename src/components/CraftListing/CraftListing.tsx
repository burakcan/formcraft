import type { Craft } from "@prisma/client";
import { CraftCard } from "@/components/CraftCard";
import { CreateCraftButton } from "@/components/CreateCraftButton";

interface Props {
  crafts: Craft[];
}

export function CraftListing(props: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your forms</h1>
        <CreateCraftButton />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {props.crafts.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </div>
  );
}
