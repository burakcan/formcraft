import type { WebhookEvent } from "@clerk/nextjs/server";
import type { Environment } from "@paddle/paddle-node-sdk";
import { Paddle } from "@paddle/paddle-node-sdk";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import db from "@/services/db";

const relevantEvents = new Set([
  "user.created",
  "user.deleted",
  "user.updated",

  "organization.created",
  "organization.updated",
  "organization.deleted",

  "organizationMembership.created",
  "organizationMembership.updated",
  "organizationMembership.deleted",
]);

async function verifyEvent(req: NextRequest): Promise<WebhookEvent> {
  if (!process.env.CLERK_SIGNING_SECRET) {
    throw new Error("Sign error");
  }

  const wh = new Webhook(process.env.CLERK_SIGNING_SECRET);
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  wh.verify(body, headers);

  return JSON.parse(body);
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyEvent(req);

    if (relevantEvents.has(event.type)) {
      const paddle = new Paddle(process.env.PADDLE_API_KEY as string, {
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environment,
      });

      switch (event.type) {
        case "user.created":
        case "user.updated": {
          await db.$transaction(async (tx) => {
            const user = await tx.user.upsert({
              where: { id: event.data.id },
              create: { id: event.data.id },
              update: { id: event.data.id },
            });

            const primaryEmail = event.data.email_addresses.find(
              (e) => e.id === event.data.primary_email_address_id
            );

            if (!primaryEmail) {
              return;
            }

            if (user.paddleCustomerId) {
              await paddle.customers.update(user.paddleCustomerId, {
                email: primaryEmail.email_address,
              });
            } else {
              const paddleCustomer = await paddle.customers.create({
                email: primaryEmail.email_address,
              });

              await tx.user.update({
                where: { id: event.data.id },
                data: {
                  paddleCustomerId: paddleCustomer.id,
                },
              });
            }
          });
          break;
        }

        case "user.deleted":
          await db.user.delete({
            where: { id: event.data.id },
          });
          break;
        case "organization.created":
        case "organization.updated": {
          await db.$transaction(async (tx) => {
            const user = await tx.user.findUniqueOrThrow({
              where: { id: event.data.created_by },
            });

            if (!user.paddleCustomerId) {
              throw new Error("User does not have a customer id");
            }

            const organization = await tx.organization.upsert({
              where: { id: event.data.id },
              update: { id: event.data.id },
              create: { id: event.data.id },
            });

            if (organization.paddleBusinessId) {
              await paddle.businesses.update(
                user.paddleCustomerId,
                organization.paddleBusinessId,
                { name: event.data.name }
              );
            } else {
              const paddleBusiness = await paddle.businesses.create(
                user.paddleCustomerId,
                { name: event.data.name }
              );

              await tx.organization.update({
                where: { id: event.data.id },
                data: {
                  paddleBusinessId: paddleBusiness.id,
                },
              });
            }
          });
          break;
        }
        case "organization.deleted":
          await db.organization.delete({
            where: { id: event.data.id },
          });
          break;
        case "organizationMembership.created":
        case "organizationMembership.updated":
          await db.user.update({
            where: { id: event.data.public_user_data.user_id },
            data: {
              organizations: {
                connect: { id: event.data.organization.id },
              },
            },
          });
          break;
        case "organizationMembership.deleted":
          await db.user.update({
            where: { id: event.data.public_user_data.user_id },
            data: {
              organizations: {
                disconnect: { id: event.data.organization.id },
              },
            },
          });
          break;
        default:
          console.log("Unhandled event type: ", event.type);
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
