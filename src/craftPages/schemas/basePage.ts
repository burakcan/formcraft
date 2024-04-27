import { z } from "zod";
import { themeImage, themeOverride } from "./theming";

const logoImage = themeImage;

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("Untitled Page").optional(),
  description: z.string().optional(),
  variableName: z.string().optional(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  logo: logoImage.optional(),
  logoPosition: z
    .enum(["top-left", "top-right", "bottom-left", "bottom-right"])
    .default("top-left"),
});

export type BasePage = z.infer<typeof basePage>;
