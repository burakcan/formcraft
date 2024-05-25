"use client";

import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CraftPreview } from "@/components/CraftPreview";

export function PreviewButton() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      {"document" in global &&
        createPortal(
          <CraftPreview open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />,
          document.body
        )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setIsPreviewOpen(true);
            }}
          >
            <EyeIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Preview</TooltipContent>
      </Tooltip>
    </>
  );
}
