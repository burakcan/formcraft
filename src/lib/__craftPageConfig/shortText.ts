import { z } from "zod";
import { basePage } from "./basePage";

export const shortText = basePage.extend({
  type: z.literal("short_text").default("short_text"),
  cta: z.string().default("Confirm"),
  maxLength: z.number().optional(),
  required: z.boolean().optional(),
});

export type ShortText = z.infer<typeof shortText>;
