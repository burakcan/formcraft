import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { stripe } from "@/services/stripe/server";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  ctx: {
    params: {
      submission_id: string;
    };
  }
) {
  try {
    const pageId = req.nextUrl.searchParams.get("pageId");
    const { submission_id } = ctx.params;

    const submission = await db.craftSubmission.findUnique({
      where: { id: submission_id },
      include: {
        craftVersion: {
          select: { data: true },
        },
        craft: {
          include: {
            user: { include: { stripeAccounts: true } },
            organization: { include: { stripeAccounts: true } },
          },
        },
      },
    });

    const orgOrUser =
      submission?.craft?.organization || submission?.craft?.user;

    const stripeAccounts = orgOrUser?.stripeAccounts;

    if (
      !submission ||
      !orgOrUser ||
      !stripeAccounts ||
      stripeAccounts.length === 0
    ) {
      throw new Error(ErrorType.Not_Found);
    }

    const page = submission.craftVersion.data.pages.find(
      (page) => page.id === pageId
    );

    if (page?.type !== "stripe_payment") {
      throw new Error(ErrorType.Not_Found);
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: (page.price || 0) * 100,
        currency: page.currency.toUpperCase(),
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      },
      { stripeAccount: stripeAccounts[0].id }
    );

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      account_id: stripeAccounts[0].id,
      intent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
  } catch (e) {
    console.log("Error in submission/[submission_id]/route.tsx", e);
    return genericApiError(e);
  }
}
