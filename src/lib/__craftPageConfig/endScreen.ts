import { z } from "zod";
import { basePage } from "./basePage";

export const endScreen = basePage.extend({
  type: z.literal("end_screen").default("end_screen"),
  cta: z.string().optional(),
  ctaLink: z.string().optional(),
});

export type EndScreen = z.infer<typeof endScreen>;
