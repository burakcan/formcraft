import type { ZodNumber } from "zod";
import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const numberInputEditorSchema = basePage.extend({
  type: z.literal("number_input").default("number_input"),
  cta: z.string().default("Confirm"),
  minValue: z.number().nullable().default(null),
  maxValue: z.number().nullable().default(null),
  required: z.boolean().default(true),
});

export type NumberInput = z.infer<typeof numberInputEditorSchema>;

export const getNumberInputViewerSchema = (page: NumberInput) => {
  let answerSchema = z.number({
    required_error: "This field is required.",
    invalid_type_error: "Please enter a number.",
  });

  if (!page.required) {
    answerSchema = answerSchema.optional() as unknown as ZodNumber;
  }

  if (page.maxValue) {
    answerSchema = answerSchema.max(page.maxValue, {
      message: `The maximum value is ${page.maxValue}.`,
    });
  }

  if (page.minValue) {
    answerSchema = answerSchema.min(page.minValue, {
      message: `The minimum value is ${page.minValue}.`,
    });
  }

  return answerSchema;
};
