import { z } from "zod";
import { basePage } from "./basePage";

export const statement = basePage.extend({
  type: z.literal("statement").default("statement"),
  cta: z.string().default("Let's go!"),
});

export type Statement = z.infer<typeof statement>;
