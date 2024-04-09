import { z } from "zod";
import { themeOverride } from "./theming";

export const basePage = z.object({
  _: z.literal("_bp_"),

  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  baseThemeId: z.string(),
  themeOverride: themeOverride,
});
