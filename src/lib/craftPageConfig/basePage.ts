import { z } from "zod";
import { themeOverride } from "./theming";

const logoImage = z.object({
  url: z.string(),
});

const mediaImage = z.object({
  type: z.literal("image"),
  url: z.string(),
  blurHash: z.string().optional().nullable(),
  attribution: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
});

const mediaYoutube = z.object({
  type: z.literal("youtube"),
  url: z.string(),
});

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("Untitled Page").optional(),
  description: z.string().optional(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  media: mediaImage.or(mediaYoutube).optional(),
  logo: logoImage.optional(),
  logoPosition: z
    .enum(["top-left", "top-right", "bottom-left", "bottom-right"])
    .default("top-left"),
});

export type BasePage = z.infer<typeof basePage>;
export type MediaImage = z.infer<typeof mediaImage>;
export type MediaYoutube = z.infer<typeof mediaYoutube>;
export type PageMedia = MediaImage | MediaYoutube;
