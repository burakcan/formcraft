import { z } from "zod";
import { fonts } from "../fonts";

export const craftTheme = z.object({
  id: z.string(),
  name: z.string(),
  font: z.enum(
    Object.keys(fonts) as [keyof typeof fonts, ...(keyof typeof fonts)[]]
  ),
  titleColor: z.string(),
  descriptionColor: z.string(),
  answersColor: z.string(),
  backgroundColor: z.string(),
  backgroundImage: z
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
  buttonColor: z.string(),
  buttonTextColor: z.string(),
  fontSize: z.enum(["small", "medium", "large"]),
  textAlign: z.enum(["left", "center", "right"]),
  isPro: z.boolean().optional(),
});

export type CraftTheme = z.infer<typeof craftTheme>;

export type BackgroundImage = CraftTheme["backgroundImage"];

export const themeOverride = craftTheme.partial();
