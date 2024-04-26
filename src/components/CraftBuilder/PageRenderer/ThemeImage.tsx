import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ThemeImageType } from "@/lib/craftPageConfig/theming";
import { cn } from "@/lib/utils";
import { useBlurDataUrl } from "@/hooks/useBlurDataURL";

interface Props {
  imageObject: ThemeImageType;
  attributionSide?: "left" | "right";
  noAttribution?: boolean;
  objectFit?: "cover" | "contain";
  noLoading?: boolean;
}

export function ThemeImage(props: Props) {
  const {
    imageObject,
    attributionSide,
    noAttribution,
    objectFit = "cover",
    noLoading,
  } = props;
  const { source } = imageObject;
  const [loading, setLoading] = useState(true);

  const blurHash = source === "unsplash" ? imageObject.blurHash : null;
  const blurDataUrl = useBlurDataUrl(blurHash);
  const blurImageUrl =
    source === "upload"
      ? `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageObject.id}/blur`
      : null;

  const url = useMemo(() => {
    if (source === "unsplash" || source === "limbo") {
      return imageObject.url;
    }

    return `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageObject.id}/public`;
  }, [imageObject, source]);

  useEffect(() => {
    setLoading(true);
  }, [url]);

  return (
    <div className="flex-1 size-full absolute top-0 left-0 not-prose overflow-hidden">
      {loading && !noLoading && (
        <div className="absolute top-4 left-4 text-white text-xs font-semibold z-20">
          <LoaderCircleIcon className="animate-spin size-8 mb-2" />
          Loading image...
        </div>
      )}

      <Image
        suppressHydrationWarning
        key={url}
        onLoad={() => setLoading(false)}
        unoptimized
        placeholder={blurDataUrl ? "blur" : undefined}
        blurDataURL={blurDataUrl}
        style={{
          objectFit,
        }}
        fill
        sizes="60vw"
        src={`${url}?auto=format,compress&&w=1920`}
        alt="theme image"
      />

      {imageObject.source === "upload" && blurImageUrl && loading && (
        <Image
          key={blurImageUrl}
          suppressHydrationWarning
          unoptimized
          style={{
            objectFit,
          }}
          fill
          sizes="60vw"
          src={blurImageUrl}
          alt="theme image"
        />
      )}

      {"attribution" in imageObject &&
        imageObject.attribution &&
        !noAttribution && (
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
              href={imageObject.attribution.url}
              target="_blank"
              rel="noreferrer"
              className="underline text-white"
            >
              {imageObject.attribution.name}
            </a>{" "}
            on Unsplash
          </div>
        )}
    </div>
  );
}
