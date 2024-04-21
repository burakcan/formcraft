import { ReplaceIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ThemeImageType } from "@/lib/craftPageConfig/theming";
import { ImageLibrary } from "../ImageLibrary/ImageLibrary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlurDataUrl } from "@/hooks/useBlurDataURL";

interface Props {
  label: string;
  value?: ThemeImageType;
  onChange: (backgroundImage?: ThemeImageType) => void;
}

export function ImageInput(props: Props) {
  const { value, onChange, label } = props;
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

  const blurDataUrl = useBlurDataUrl(value?.blurHash || undefined);

  return (
    <div className="flex flex-col gap-2 items-start">
      <ImageLibrary
        currentValue={value}
        open={showLibrary}
        onOpenChange={setShowLibrary}
        onImageSelect={onChange}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <Label className="font-normal">{label}</Label>
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
          <Image
            suppressHydrationWarning
            unoptimized
            key={value.url}
            placeholder={blurDataUrl ? "blur" : undefined}
            blurDataURL={blurDataUrl}
            src={value.url}
            alt="background image"
            style={{
              objectFit: "cover",
            }}
            fill
            sizes="20vw"
          />
          <div className="absolute top-2 right-2 flex gap-2">
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
