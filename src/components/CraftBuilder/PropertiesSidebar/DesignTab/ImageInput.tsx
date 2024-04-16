import { ReplaceIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function ImageInput(props: Props) {
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-2 items-start">
      <Label className="font-normal">Background image</Label>
      {!value && (
        <div className="w-full h-32 relative border rounded-md overflow-hidden bg-secondary flex items-center justify-center">
          <Button variant="outline">Choose image</Button>
        </div>
      )}
      {value && (
        <div className="w-full h-32 relative border rounded-md overflow-hidden">
          <Image
            src={value}
            alt="background image"
            style={{
              objectFit: "cover",
            }}
            fill
            sizes="20vw"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              onClick={() => onChange("")}
              className="size-8"
              variant="secondary"
            >
              <ReplaceIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => onChange("")}
              className="size-8"
              variant="secondary"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
