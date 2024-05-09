import { z } from "zod";
import { themeImage, themeOverride } from "./theming";

const logoImage = themeImage;

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("Untitled Page").optional(),
  description: z.string().optional(),
  variableName: z.string().optional().nullable(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  logo: logoImage.optional(),
});

export type BasePage = z.infer<typeof basePage>;
