import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const opinionScaleEditorSchema = basePage.extend({
  type: z.literal("opinion_scale").default("opinion_scale"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  min: z.number().default(1),
  max: z.number().default(10),
});

export type OpinionScale = z.infer<typeof opinionScaleEditorSchema>;

export const getOpinionScaleViewerSchema = (page: OpinionScale) => {
  let answerSchema = z.number({
    required_error: "This field is required.",
    invalid_type_error: "This field is required.",
  });

  if (page.required) {
    answerSchema = answerSchema.min(page.min, {
      message: `This field is required.`,
    });
  }

  return answerSchema;
};
