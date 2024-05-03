import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const longTextEditorSchema = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  cta: z.string().default("Confirm"),
  minLength: z.number().default(0),
  maxLength: z.number().default(1000),
});

export type LongText = z.infer<typeof longTextEditorSchema>;

export const getLongTextViewerSchema = (page: LongText) => {
  let answerSchema = z.string();

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
