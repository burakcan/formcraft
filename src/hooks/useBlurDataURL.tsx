import { decode } from "blurhash";
import { useMemo } from "react";

export function useBlurDataUrl(blurHash?: string | null) {
  return useMemo(() => {
    if (!blurHash || typeof window === "undefined") {
      return undefined;
    }

    const pixels = decode(blurHash, 32, 32);
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const imageData = ctx.createImageData(32, 32);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  }, [blurHash]);
}
