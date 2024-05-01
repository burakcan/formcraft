import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const shortTextEditorSchema = basePage.extend({
  type: z.literal("short_text").default("short_text"),
  cta: z.string().default("Confirm"),
  maxLength: z.number().optional(),
  required: z.boolean().default(true),
});

export const shortTextViewerSchema = z.string();

export type ShortText = z.infer<typeof shortTextEditorSchema>;

export type ShortTextAnswer = z.infer<typeof shortTextViewerSchema>;
