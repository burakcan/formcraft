import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useBlurDataUrl } from "@/hooks/useBlurDataURL";

interface Props {
  url: string;
  blurHash?: string | null;
  attribution?: {
    name: string;
    url: string;
  };
  attributionSide?: "left" | "right";
}

export function ThemeImage(props: Props) {
  const { url, blurHash, attribution, attributionSide } = props;
  const [loading, setLoading] = useState(false);
  const blurDataUrl = useBlurDataUrl(blurHash);

  return (
    <div className="flex-1 size-full absolute top-0 left-0 not-prose overflow-hidden">
      {loading && (
        <div className="absolute top-4 left-4 text-white text-xs font-semibold z-20">
          <LoaderCircleIcon className="animate-spin size-8 mb-2" />
          Loading image...
        </div>
      )}

      <Image
        suppressHydrationWarning
        onLoad={() => setLoading(false)}
        unoptimized
        key={url}
        placeholder={blurDataUrl ? "blur" : undefined}
        blurDataURL={blurDataUrl}
        style={{
          objectFit: "cover",
        }}
        fill
        sizes="60vw"
        src={url}
        alt="theme image"
      />

      {attribution && (
        <div
          className={cn("absolute bottom-1 text-white text-xs z-20", {
            ["left-1"]: attributionSide === "left",
            ["right-1"]: attributionSide === "right",
            ["text-left"]: attributionSide === "left",
            ["text-right"]: attributionSide === "right",
          })}
        >
          Photo by{" "}
          <a
            href={attribution.url}
            target="_blank"
            rel="noreferrer"
            className="underline text-white"
          >
            {attribution.name}
          </a>{" "}
          on Unsplash
        </div>
      )}
    </div>
  );
}
