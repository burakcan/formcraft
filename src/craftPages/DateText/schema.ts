import type { ZodString } from "zod";
import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const dateTextEditorSchema = basePage.extend({
  type: z.literal("date_text").default("date_text"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  dateFormat: z.enum(["DDMMYYYY", "MMDDYYYY", "YYYYMMDD"]).default("DDMMYYYY"),
  separator: z.enum(["/", "-", "."]).default("/"),
});

export type DateText = z.infer<typeof dateTextEditorSchema>;
export type DateFormat = DateText["dateFormat"];
export type Separator = DateText["separator"];

export const getDateTextViewerSchema = (page: DateText) => {
  let answerSchema = z
    .string({
      required_error: "This field is required.",
      invalid_type_error: "Please enter a valid date.",
    })
    .datetime({
      message: "Please enter a valid date.",
    });

  if (!page.required) {
    answerSchema = answerSchema.optional() as unknown as ZodString;
  }

  return answerSchema;
};
