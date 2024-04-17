import { z } from "zod";
import { themeOverride } from "./theming";

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("Untitled Page").optional(),
  description: z.string().optional(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  media: z
    .object({
      url: z.string(),
      blurHash: z.string().optional().nullable(),
      attribution: z
        .object({
          name: z.string(),
          url: z.string(),
        })
        .optional(),
    })
    .optional(),
  mediaLayout: z
    .enum([
      "left-full",
      "right-full",
      "left-boxed",
      "right-boxed",
      "middle-boxed",
    ])
    .default("right-full"),
});

export type BasePage = z.infer<typeof basePage>;

export type PageMedia = BasePage["media"];
