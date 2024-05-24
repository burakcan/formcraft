import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/services/db";
import { genericApiError } from "@/lib/utils";

// stripe connect
export const revalidate = 0;
export async function GET() {
  try {
    const authData = auth();
    const { orgId, userId } = authData;

    if (!authData || !userId) {
      return new Response(null, { status: 401 });
    }

    const stripeAccount = await db.stripeAccount.findFirst({
      where: {
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
    });

    if (!stripeAccount) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(stripeAccount);
  } catch (error) {
    console.log(error);
    return genericApiError(error);
  }
}
