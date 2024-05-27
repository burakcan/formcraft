import { z } from "zod";
import { themeImage, themeOverride } from "./theming";

const logoImage = themeImage;

const contentArray = z.array(
  z
    .object({
      type: z.literal("text"),
      text: z.string(),
    })
    .or(
      z.object({
        type: z.literal("recall"),
        attrs: z.object({
          pageId: z.string(),
          label: z.string(),
        }),
      })
    )
);

export const basePage = z.object({
  _: z.literal("_bp_").default("_bp_"),

  id: z.string(),
  title: z.string().default("").optional(),
  description: z.string().optional(),
  baseContent: z
    .object({
      type: z.literal("doc"),
      content: z.tuple([
        z
          .object({
            type: z.literal("title"),
            content: contentArray.optional(),
          })
          .optional(),
        z
          .object({
            type: z.literal("description"),
            content: contentArray.optional(),
          })
          .optional(),
      ]),
    })
    .optional(),
  variableName: z.string().optional().nullable(),
  baseThemeId: z.string().default("default"),
  themeOverride: themeOverride.default({}),
  logo: logoImage.optional(),
});

export type BasePage = z.infer<typeof basePage>;
