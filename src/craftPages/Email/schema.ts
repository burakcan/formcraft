import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const emailEditorSchema = basePage.extend({
  type: z.literal("email").default("email"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
});

export type Email = z.infer<typeof emailEditorSchema>;

export const getEmailViewerSchema = (page: Email) => {
  let answerSchema = z
    .string({
      invalid_type_error: "Please enter a valid email address.",
      required_error: "Please enter an email address.",
    })
    .email({
      message: "Please enter a valid email address.",
    });

  if (!page.required) {
    return answerSchema.optional();
  }

  return answerSchema;
};

export type EmailValue = z.infer<ReturnType<typeof getEmailViewerSchema>>;
