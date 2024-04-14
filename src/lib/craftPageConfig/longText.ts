import { z } from "zod";
import { basePage } from "./basePage";

export const longText = basePage.extend({
  type: z.literal("long_text").default("long_text"),
  maxLength: z.number().optional(),
  required: z.boolean().optional(),
});

export type LongText = z.infer<typeof longText>;
