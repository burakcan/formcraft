"use client";

import { CheckIcon, CopyIcon, FrameIcon, LinkIcon } from "lucide-react";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UnpublishedAlert } from "../UnpublishedAlert";
import { ShareCard } from "./ShareCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CraftShare() {
  const craftId = useEditCraftStore((state) => state.craft.id);
  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const link = `https://formcraft.io/forms/${craftId}`;
  const embed = `<iframe src="https://formcraft.io/forms/${craftId}" width="100%" height="800px" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embed);
    setEmbedCopied(true);
    setTimeout(() => {
      setEmbedCopied(false);
    }, 3000);
  };

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
            <Input value={link} readOnly className="w-full" />
            <Button
              size="icon"
              className={cn("w-12", {
                "bg-emerald-500": linkCopied,
              })}
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <CheckIcon className="size-5" />
              ) : (
                <CopyIcon className="size-5" />
              )}
            </Button>
          </div>
        </ShareCard>
        <ShareCard
          title="Iframe Embed"
          description="Embed your form on your website."
          icon={FrameIcon}
          iconClassName="text-rose-500"
        >
          <div className="flex gap-2">
            <Input value={embed} readOnly className="w-full" />
            <Button
              size="icon"
              className={cn("w-12", {
                "bg-emerald-500": embedCopied,
              })}
              onClick={handleCopyEmbed}
            >
              {embedCopied ? (
                <CheckIcon className="size-5" />
              ) : (
                <CopyIcon className="size-5" />
              )}
            </Button>
          </div>
        </ShareCard>
      </div>
    </div>
  );
}
