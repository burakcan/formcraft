import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const endScreenEditorSchema = basePage.extend({
  type: z.literal("end_screen").default("end_screen"),
  showCta: z.boolean().default(true),
  cta: z.string().default("Create your own form"),
  ctaLink: z.string().url().default("https://formcraft.io"),
});

export const endScreenViewerSchema = z.object({});

export type EndScreen = z.infer<typeof endScreenEditorSchema>;

export type EndScreenAnswer = z.infer<typeof endScreenViewerSchema>;
