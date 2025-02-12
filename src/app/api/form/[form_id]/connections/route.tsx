import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { EmailConnection, WebhookConnection } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { getCraftConnections } from "@/services/db/craft";
import { emailConnectionConfirmation } from "@/services/email/emailConnectionConfirmation";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{ form_id: string }>;
  }
) {
  try {
    return NextResponse.json(await getCraftConnections((await ctx.params).form_id));
  } catch (error) {
    return genericApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  ctx: {
    params: Promise<{ form_id: string }>;
  }
) {
  try {
    const authData = await auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const { email, webhook, googleSheets } = (await req.json()) as {
      email?: EmailConnection | null;
      webhook?: WebhookConnection | null;
      googleSheets?: { sheetId: string; sheetUrl: string } | null;
    };

    const craft = await db.craft.update({
      where: {
        id: (await ctx.params).form_id,
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
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
        googleSheetsConnection: {
          select: {
            sheetId: true,
            sheetUrl: true,
          },
        },
      },
      data: {
        emailConnection:
          email === null
            ? { delete: true }
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

        googleSheetsConnection:
          googleSheets === null
            ? { delete: true }
            : googleSheets === undefined
            ? {}
            : {
                update: {
                  sheetId: googleSheets.sheetId,
                },
              },
      },
    });

    if (email && !email.confirmedAt) {
      const { confirmationCode } =
        (await db.emailConnection.findFirst({
          where: {
            email: email.email,
          },
          select: {
            confirmationCode: true,
          },
        })) || {};

      if (confirmationCode) {
        await emailConnectionConfirmation(email.email, confirmationCode, craft);
      }
    }

    return NextResponse.json({
      email: craft.emailConnection,
      webhook: craft.webhookConnection,
      googleSheets: craft.googleSheetsConnection,
    });
  } catch (error) {
    return genericApiError(error);
  }
}
