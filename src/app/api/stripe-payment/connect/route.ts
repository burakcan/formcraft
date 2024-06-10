import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { stripe } from "@/services/stripe/server";
import { genericApiError } from "@/lib/utils";

export const revalidate = 0;
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const returnUrl = params.get("r") || "/stripe-connected";
    const authData = auth();
    const { orgId, userId } = authData;

    if (!authData || !userId) {
      return new Response(null, { status: 401 });
    }

    let dbStripeAccount = await db.stripeAccount.findFirst({
      where: {
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
    });

    if (!dbStripeAccount) {
      console.log("create new stripe account");
      const account = await stripe.accounts.create({
        type: "standard",
      });

      dbStripeAccount = await db.stripeAccount.create({
        data: {
          id: account.id,
          userId: authData.userId,
          organizationId: authData.orgId,
          charges_enabled: account.charges_enabled,
          details_submitted: account.details_submitted,
        },
      });
    }

    if (!dbStripeAccount) {
      throw new Error("Failed to create stripe account");
    }

    const accountLink = await stripe.accountLinks.create({
      account: dbStripeAccount.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/api/stripe-payment/connect`,
      return_url: `${process.env.NEXT_PUBLIC_URL}${returnUrl}`,
      type: "account_onboarding",
      collect: "eventually_due",
    });

    return NextResponse.json(accountLink);
  } catch (error) {
    console.log(error);
    return genericApiError(error);
  }
}
