import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getStripeSubscription } from "@/services/stripe/server";
import { genericApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const organization = req.nextUrl.searchParams.get("f") === "o";
    const authData = auth();

    const result = await getStripeSubscription(
      authData.orgId && organization
        ? {
            organizationId: authData.orgId,
          }
        : {
            userId: authData.userId!,
          }
    );

    return NextResponse.json(result);
  } catch (error) {
    return genericApiError(error);
  }
}
