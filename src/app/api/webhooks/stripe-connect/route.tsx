import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import {
  deleteStripeAccount,
  updateStripeAccount,
} from "@/services/stripe/connect";
import { stripe } from "@/services/stripe/server";

const signingSecret = process.env.STRIPE_CONNECT_WEBHOOK_SIGNING_SECRET || "";

const relevantEvents = new Set([
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
