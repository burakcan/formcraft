import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const websiteEditorSchema = basePage.extend({
  type: z.literal("website").default("website"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
});

export type Website = z.infer<typeof websiteEditorSchema>;

export const getWebsiteViewerSchema = (page: Website) => {
  let answerSchema = z
    .string({
      invalid_type_error: "Please enter a valid URL",
      required_error: "Please enter a URL",
    })
    .url({
      message: "Please enter a valid URL",
    });

  if (!page.required) {
    return answerSchema.optional();
  }

  return answerSchema;
};
