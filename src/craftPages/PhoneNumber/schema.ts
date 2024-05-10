import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const phoneNumberEditorSchema = basePage.extend({
  type: z.literal("phone_number").default("phone_number"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
});

export type PhoneNumber = z.infer<typeof phoneNumberEditorSchema>;

export const getPhoneNumberViewerSchema = (page: PhoneNumber) => {
  let answerSchema = z
    .string({
      invalid_type_error: "Please enter a valid phone number.",
      required_error: "Please enter a phone number.",
    })
    .optional()
    .default("")
    .refine(
      (value) => {
        if (!value) {
          return !page.required;
        }

        if (page.required || value !== "") {
          return isValidPhoneNumber(value);
        }

        return true;
      },
      {
        message: "Please enter a valid phone number.",
      }
    );

  return answerSchema;
};
