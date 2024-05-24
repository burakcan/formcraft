import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  ctx: { params: { form_id: string } }
) {
  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const existingForm = await db.craft.findFirst({
      where: {
        id: ctx.params.form_id,
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
      include: {
        craftVersions: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!existingForm) {
      throw new Error(ErrorType.Not_Found);
    }

    const newForm = await db.craft.create({
      data: {
        ...existingForm,
        createdAt: undefined,
        updatedAt: undefined,
        archivedAt: undefined,
        id: undefined,
        organizationId: orgId,
        userId: userId,
        title: `${existingForm.title} (Copy)`,
        craftSubmissions: undefined,
        emailConnection: undefined,
        emailConnectionId: undefined,
        googleSheetsConnection: undefined,
        googleSheetsConnectionId: undefined,
        webhookConnection: undefined,
        webhookConnectionId: undefined,
        craftVersions: {
          create: [
            {
              data: existingForm.craftVersions[0].data,
            },
          ],
        },
      },
    });

    return NextResponse.json(newForm);
  } catch (error) {
    console.log(error);
    return genericApiError(error);
  }
}
