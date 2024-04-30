import { ReplaceAllIcon, ReplaceIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { ImageLibrary } from "../ImageLibrary/ImageLibrary";
import { ThemeImage } from "../PageRenderer/ThemeImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ThemeImageType } from "@/craftPages/schemas/theming";

interface Props {
  label: string;
  value?: ThemeImageType;
  onChange: (backgroundImage?: ThemeImageType) => void;
  onApplyToAll?: () => void;
  defaultLibraryTab?: "unsplash" | "upload" | "library";
}

export function ImageInput(props: Props) {
  const { value, onChange, label, onApplyToAll, defaultLibraryTab } = props;
  const [prevValue, setPrevValue] = useState(value);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleReplace = () => {
    setPrevValue(value);
    setShowLibrary(true);
  };

  const handleCancel = () => {
    onChange(prevValue);
    setShowLibrary(false);
  };

  const handleSave = () => {
    setPrevValue(value);
    onChange(value);
    setShowLibrary(false);
  };

  const handleChange = (image?: ThemeImageType) => {
    if (image) {
      onChange(image);
    } else {
      onChange(prevValue);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <ImageLibrary
        defaultTab={defaultLibraryTab}
        currentValue={value}
        open={showLibrary}
        onOpenChange={setShowLibrary}
        onImageSelect={handleChange}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <Label>{label}</Label>
      {!value && (
        <div
          className="w-full h-32 relative border rounded-md overflow-hidden bg-secondary flex items-center justify-center"
          onClick={() => setShowLibrary(true)}
        >
          <Button variant="outline">Choose image</Button>
        </div>
      )}
      {value && (
        <div className="w-full h-32 relative border rounded-md overflow-hidden">
          <ThemeImage imageObject={value} noAttribution />
          <div className="absolute top-2 right-2 flex gap-2">
            {onApplyToAll && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      onClick={onApplyToAll}
                      className="size-8"
                      variant="secondary"
                    >
                      <ReplaceAllIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Apply to all pages</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={handleReplace}
                    className="size-8"
                    variant="secondary"
                  >
                    <ReplaceIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Replace image</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={() => onChange(undefined)}
                    className="size-8"
                    variant="secondary"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Remove image</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}
