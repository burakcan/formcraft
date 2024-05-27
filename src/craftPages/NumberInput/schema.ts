import type { ZodNumber } from "zod";
import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const numberInputEditorSchema = basePage.extend({
  type: z.literal("number_input").default("number_input"),
  cta: z.string().default("Confirm"),
  min: z.number().optional().nullable(),
  max: z.number().optional().nullable(),
  required: z.boolean().default(false),
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

  if (page.max) {
    answerSchema = answerSchema.max(page.max, {
      message: `The maximum value is ${page.max}.`,
    });
  }

  if (page.min) {
    answerSchema = answerSchema.min(page.min, {
      message: `The minimum value is ${page.min}.`,
    });
  }

  return answerSchema;
};

export type NumberInputValue = z.infer<
  ReturnType<typeof getNumberInputViewerSchema>
>;
