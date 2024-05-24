import type Stripe from "stripe";
import db from "../db";

export async function updateStripeAccount(account: Stripe.Account) {
  console.log("Updating Stripe account", account.id);

  await db.stripeAccount.update({
    where: { id: account.id },
    data: {
      charges_enabled: account.charges_enabled,
      transfers_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    },
  });
}

export async function deleteStripeAccount(accountId: string) {
  console.log("Deleting Stripe account", accountId);

  await db.stripeAccount.delete({ where: { id: accountId } });
}
