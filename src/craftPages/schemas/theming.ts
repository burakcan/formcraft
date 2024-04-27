import { z } from "zod";

export const unsplashImage = z.object({
  url: z.string(),
  source: z.literal("unsplash"),
  blurHash: z.string().optional().nullable(),
  attribution: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
});

export const uploadedImage = z.object({
  source: z.literal("upload"),
  id: z.string(),
});

export const limboImage = z.object({
  source: z.literal("limbo"),
  url: z.string(),
});

export const themeImage = z
  .union([unsplashImage, uploadedImage, limboImage])
  .nullable();

export const craftTheme = z.object({
  id: z.string(),
  name: z.string(),
  titleFont: z.string().default("Inter"),
  descriptionFont: z.string().default("Inter"),
  titleColor: z.string(),
  descriptionColor: z.string(),
  answersColor: z.string(),
  backgroundColor: z.string(),
  backgroundImage: themeImage.optional(),
  decorationImage: themeImage.optional(),
  decorationImageLayout: z
    .enum(["left-full", "right-full"])
    .default("left-full"),
  buttonColor: z.string(),
  buttonTextColor: z.string(),
  fontSize: z.enum(["small", "medium", "large"]),
  textAlign: z.enum(["left", "center", "right"]),
  isPro: z.boolean().optional(),
});

export type CraftTheme = z.infer<typeof craftTheme>;
export type ThemeImageType = z.infer<typeof themeImage>;

export const themeOverride = craftTheme.partial();
