import { z } from "zod";
import { themeOverride } from "./theming";

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
});

export type BasePage = z.infer<typeof basePage>;
export type MediaImage = z.infer<typeof mediaImage>;
export type MediaYoutube = z.infer<typeof mediaYoutube>;
export type PageMedia = MediaImage | MediaYoutube;
