import { z } from "zod";
import { basePage } from "./basePage";

export const longText = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  cta: z.string().default("Confirm"),
  maxLength: z.number().optional(),
  required: z.boolean().optional(),
});

export type LongText = z.infer<typeof longText>;
