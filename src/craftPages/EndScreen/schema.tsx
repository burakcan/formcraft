import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const endScreenEditorSchema = basePage.extend({
  type: z.literal("end_screen").default("end_screen"),
  cta: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const endScreenViewerSchema = z.object({});

export type EndScreen = z.infer<typeof endScreenEditorSchema>;

export type EndScreenAnswer = z.infer<typeof endScreenViewerSchema>;
