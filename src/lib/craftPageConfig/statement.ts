import { z } from "zod";
import { basePage } from "./basePage";

export const statement = basePage.extend({
  type: z.literal("statement"),
  cta: z.string(),
});

export type Statement = z.infer<typeof statement>;
