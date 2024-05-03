import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const endScreenEditorSchema = basePage.extend({
  type: z.literal("end_screen").default("end_screen"),
  showCta: z.boolean().default(true),
  cta: z.string().default("Create your own form"),
  ctaLink: z.string().url().default("https://formcraft.io"),
});

export type EndScreen = z.infer<typeof endScreenEditorSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEndScreenViewerSchema = (page: EndScreen) => {
  const answerSchema = z.any();
  return answerSchema;
};
