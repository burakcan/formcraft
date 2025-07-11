import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ form_id: string }> }
) {
  try {
    const authData = await auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const json = (await req.json()) as {
      id: string;
      title: string;
    };

    const result = await db.craft.update({
      select: {
        id: true,
        title: true,
      },
      where: {
        id: (await ctx.params).form_id,
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
      data: {
        title: json.title,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return genericApiError(error);
  }
}
