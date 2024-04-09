import { z } from "zod";

export const craftTheme = z.object({
  id: z.string(),
  name: z.string(),
  font: z.string(),
  titleColor: z.string(),
  descriptionColor: z.string(),
  answersColor: z.string(),
  backgroundColor: z.string(),
  backgroundImageUrl: z.string().optional(),
  buttonColor: z.string(),
  buttonTextColor: z.string(),
  fontSize: z.enum(["small", "medium", "large"]),
  textAlign: z.enum(["left", "center", "right"]),
  mediaUrl: z.string().optional(),
  mediaLayout: z.enum([
    "left-full",
    "right-full",
    "left-boxed",
    "right-boxed",
    "middle-boxed",
  ]),
});

export const themeOverride = craftTheme.partial();
