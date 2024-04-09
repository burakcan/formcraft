import type { WebhookEvent } from "@clerk/nextjs/server";
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
      switch (event.type) {
        case "user.created":
        case "user.updated":
          await db.user.upsert({
            where: { id: event.data.id },
            update: { id: event.data.id },
            create: { id: event.data.id },
          });
          break;
        case "user.deleted":
          await db.user.delete({
            where: { id: event.data.id },
          });
          break;
        case "organization.created":
        case "organization.updated":
          await db.organization.upsert({
            where: { id: event.data.id },
            update: { id: event.data.id },
            create: { id: event.data.id },
          });
          break;
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
