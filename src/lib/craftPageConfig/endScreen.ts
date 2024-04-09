import { z } from "zod";
import { basePage } from "./basePage";

export const endScreen = basePage.extend({
  type: z.literal("end_screen"),
  cta: z.string(),
  ctaLink: z.string(),
});

export type EndScreen = z.infer<typeof endScreen>;
