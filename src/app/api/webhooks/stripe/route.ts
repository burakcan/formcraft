import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import {
  deleteStripeAccount,
  updateStripeAccount,
} from "@/services/stripe/connect";
import {
  deleteStripePrice,
  deleteStripeProduct,
  stripe,
  upsertStripePrice,
  upsertStripeProduct,
  upsertStripeSubscription,
} from "@/services/stripe/server";

const signingSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET || "";

const relevantEvents = new Set([
  "product.created",
  "product.deleted",
  "product.updated",
  "price.created",
  "price.deleted",
  "price.updated",

  "customer.subscription.created",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",
  "customer.subscription.updated",

  "account.application.authorized",
  "account.application.deauthorized",
  "account.updated",
]);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, signingSecret);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  console.log("Received event: ", event.type);

  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case "product.created":
      case "product.updated":
        await upsertStripeProduct(event.data.object);
        break;

      case "product.deleted":
        await deleteStripeProduct(event.data.object.id);
        break;

      case "price.created":
      case "price.updated":
        await upsertStripePrice(event.data.object);
        break;

      case "price.deleted":
        await deleteStripePrice(event.data.object.id);
        break;

      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
      case "customer.subscription.trial_will_end":
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        await upsertStripeSubscription(event.data.object);
        break;
      }

      case "account.updated":
        await updateStripeAccount(event.data.object);
        break;

      case "account.application.deauthorized":
        deleteStripeAccount(event.data.object.id);
        break;

      default:
        console.log("Unhandled event type: ", event.type);
        break;
    }
  }

  return NextResponse.json({ received: true });
}
