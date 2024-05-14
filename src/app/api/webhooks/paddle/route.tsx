import type { Environment } from "@paddle/paddle-node-sdk";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { PaddleCollectionMode, PaddleSubscriptionStatus } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/services/db";

const relevantEvents = new Set([
  EventName.SubscriptionCreated,
  EventName.SubscriptionUpdated,
]);

export async function POST(req: NextRequest) {
  try {
    const signature = (req.headers.get("paddle-signature") as string) || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";
    const paddle = new Paddle(process.env.PADDLE_API_KEY as string, {
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environment,
    });

    if (!signature || !secretKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await req.text();

    const event = await paddle.webhooks.unmarshal(
      requestBody,
      secretKey,
      signature
    );

    if (event && relevantEvents.has(event.eventType)) {
      switch (event.eventType) {
        case EventName.SubscriptionUpdated:
        case EventName.SubscriptionCreated: {
          db.$transaction(async (tx) => {
            const user = event.data.customerId
              ? await tx.user.findFirst({
                  where: { paddleCustomerId: event.data.customerId },
                })
              : null;

            const organization = event.data.businessId
              ? await tx.organization.findFirst({
                  where: { paddleBusinessId: event.data.businessId },
                })
              : null;

            const data = {
              id: event.data.id,
              occured_at: event.occurredAt,
              status: {
                active: PaddleSubscriptionStatus.ACTIVE,
                canceled: PaddleSubscriptionStatus.CANCELLED,
                past_due: PaddleSubscriptionStatus.PAST_DUE,
                paused: PaddleSubscriptionStatus.PAUSED,
                trialing: PaddleSubscriptionStatus.TRIALING,
              }[event.data.status],
              customer_id: event.data.customerId,
              collection_mode: {
                manual: PaddleCollectionMode.MANUAL,
                automatic: PaddleCollectionMode.AUTOMATIC,
              }[event.data.collectionMode],
              price_id: event.data.items[0].price!.id,
              product_id: event.data.items[0].price!.productId,
              scheduled_change: event.data.scheduledChange,
              userId: user?.id || undefined,
              organizationId: organization?.id || undefined,
            };

            const subscription = await tx.paddleSubscription.upsert({
              where: { id: data.id },
              create: data,
              update: data,
            });

            return subscription;
          });

          break;
        }

        default:
          break;
      }
    }
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "ok" });
}

export async function GET() {
  return NextResponse.json({ message: "ok" });
}
