import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const stripePaymentEditorSchema = basePage.extend({
  type: z.literal("stripe_payment").default("stripe_payment"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
});

export type StripePayment = z.infer<typeof stripePaymentEditorSchema>;

export const getStripePaymentViewerSchema = () => {
  let answerSchema = z.string();

  return answerSchema.default("");
};
