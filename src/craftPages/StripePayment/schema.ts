import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const stripePaymentEditorSchema = basePage.extend({
  type: z.literal("stripe_payment").default("stripe_payment"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  price: z.number().optional().nullable(),
  currency: z.string().default("usd"),
  // reserved for future use. Currently we use the account's stripe account only.
  stripeAccountId: z.string().default(""),
});

export type StripePayment = z.infer<typeof stripePaymentEditorSchema>;

export const getStripePaymentViewerSchema = (page: StripePayment) => {
  let answerSchema = z.strictObject({
    intentId: z.string(),
    paid: z.literal(true),
  });

  if (!page.required) {
    return answerSchema.or(
      answerSchema.extend({
        paid: z.literal(false),
      })
    );
  }

  return answerSchema;
};

export type StripePaymentValue = z.infer<
  ReturnType<typeof getStripePaymentViewerSchema>
>;
