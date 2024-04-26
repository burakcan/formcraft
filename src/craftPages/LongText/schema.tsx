import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const longTextEditorSchema = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  cta: z.string().default("Confirm"),
  maxLength: z.number().optional(),
  required: z.boolean().optional(),
});

export const longTextViewerSchema = z.object({});

export type LongText = z.infer<typeof longTextEditorSchema>;

export type LongTextAnswer = z.infer<typeof longTextViewerSchema>;
