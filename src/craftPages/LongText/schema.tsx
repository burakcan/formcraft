import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const longTextEditorSchema = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  minLength: z.number().optional().nullable(),
  maxLength: z.number().optional().nullable(),
});

export type LongText = z.infer<typeof longTextEditorSchema>;

export const getLongTextViewerSchema = (page: LongText) => {
  let answerSchema = z.string();

  if (page.required) {
    answerSchema = answerSchema.min(1, {
      message: "This field is required.",
    });
  }

  if (page.minLength) {
    answerSchema = answerSchema.min(page.minLength, {
      message: `Please enter at least ${page.minLength} characters.`,
    });
  }

  if (page.maxLength) {
    answerSchema = answerSchema.max(page.maxLength, {
      message: `Please enter no more than ${page.maxLength} characters.`,
    });
  }

  return answerSchema.default("");
};
