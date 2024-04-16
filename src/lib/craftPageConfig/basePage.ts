import { z } from "zod";
import { themeOverride } from "./theming";

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("Untitled Page").optional(),
  description: z.string().optional(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  mediaUrl: z.string().optional(),
  mediaLayout: z
    .enum([
      "left-full",
      "right-full",
      "left-boxed",
      "right-boxed",
      "middle-boxed",
    ])
    .optional(),
});
