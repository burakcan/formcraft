import "server-only";
import { auth } from "@clerk/nextjs";
import type { EmailConnection, WebhookConnection } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";
import db from "@/services/db";
import { getCraftConnections } from "@/services/db/craft";

export async function GET(
  req: NextRequest,
  ctx: {
    params: { form_id: string };
  }
) {
  try {
    return NextResponse.json(await getCraftConnections(ctx.params.form_id));
  } catch (error) {
    return genericApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  ctx: {
    params: { form_id: string };
  }
) {
  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const { email, webhook } = (await req.json()) as {
      email?: EmailConnection | null;
      webhook?: WebhookConnection | null;
    };

    const craft = await db.craft.update({
      include: {
        emailConnection: {
          select: {
            email: true,
            confirmedAt: true,
          },
        },
        webhookConnection: {
          select: {
            url: true,
            secret: true,
          },
        },
      },
      where: {
        id: ctx.params.form_id,
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
      data: {
        emailConnection:
          email === null
            ? {
                delete: true,
              }
            : email === undefined
            ? {}
            : {
                upsert: {
                  create: {
                    email: email.email,
                  },
                  update: {
                    email: email.email,
                    confirmedAt: null,
                  },
                },
              },

        webhookConnection:
          webhook === null
            ? { delete: true }
            : webhook === undefined
            ? {}
            : {
                upsert: {
                  create: {
                    url: webhook.url,
                  },
                  update: {
                    url: webhook.url,
                  },
                },
              },
      },
    });

    return NextResponse.json({
      email: craft.emailConnection,
      webhook: craft.webhookConnection,
    });
  } catch (error) {
    return genericApiError(error);
  }
}
