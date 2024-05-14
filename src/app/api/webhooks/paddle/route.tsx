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

const ipWhiteList = new Set([
  "34.194.127.46",
  "54.234.237.108",
  "3.208.120.145",
  "44.226.236.210",
  "44.241.183.62",
  "100.20.172.113",
  "34.232.58.13",
  "34.195.105.136",
  "34.237.3.244",
  "35.155.119.135",
  "52.11.166.252",
  "34.212.5.7",
]);

export async function POST(req: NextRequest) {
  const ip = req.ip;

  if (!ip || !ipWhiteList.has(ip)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
