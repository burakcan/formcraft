"use client";

import { LinkIcon } from "lucide-react";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UnpublishedAlert } from "../UnpublishedAlert";
import { ShareCard } from "./ShareCard";

export function CraftShare() {
  const craftId = useEditCraftStore((state) => state.craft.id);

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <UnpublishedAlert />
      </div>
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold">Share</h1>
        <p className="text-gray-500 mt-2">Share your form with the world.</p>
      </div>
      <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-2 my-4 pb-24">
        <ShareCard
          title="Share Link"
          description="Share your form by sharing the link."
          icon={LinkIcon}
          iconClassName="text-blue-500"
        >
          <div className="flex gap-2">
            <Input
              value={`https://formcraft.io/form/${craftId}`}
              readOnly
              className="w-full"
            />
            <Button>Copy Link</Button>
          </div>
        </ShareCard>
      </div>
    </div>
  );
}
