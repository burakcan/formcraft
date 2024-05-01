import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const longTextEditorSchema = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  cta: z.string().default("Confirm"),
  minLength: z.number().default(0),
  maxLength: z.number().default(1000),
});

export const longTextViewerSchema = z.object({});

export type LongText = z.infer<typeof longTextEditorSchema>;

export type LongTextAnswer = z.infer<typeof longTextViewerSchema>;
