import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const shortTextEditorSchema = basePage.extend({
  type: z.literal("short_text").default("short_text"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  maxLength: z.number().optional().nullable(),
});

export type ShortText = z.infer<typeof shortTextEditorSchema>;

export const getShortTextViewerSchema = (page: ShortText) => {
  let answerSchema = z.string();

  if (page.required) {
    answerSchema = answerSchema.min(1, {
      message: "This field is required.",
    });
  } else {
    answerSchema = answerSchema.min(0);
  }

  if (page.maxLength) {
    answerSchema = answerSchema.max(page.maxLength, {
      message: `Please enter no more than ${page.maxLength} characters.`,
    });
  }

  return answerSchema.default("");
};
