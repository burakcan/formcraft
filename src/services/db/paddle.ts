import "server-only";
import { auth } from "@clerk/nextjs";
import { PaddleSubscriptionStatus } from "@prisma/client";
import { ErrorType } from "@/lib/errors";
import db from ".";

export async function getPaddleIds() {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  return await db.$transaction(async (tx) => {
    let organization;

    if (orgId) {
      organization = await tx.organization.findUnique({
        where: {
          id: orgId,
        },
      });
    }

    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });

    const subscription = await tx.paddleSubscription.findFirst({
      where: {
        OR: [
          { status: PaddleSubscriptionStatus.ACTIVE },
          { status: PaddleSubscriptionStatus.TRIALING },
        ],
        organizationId: orgId ? orgId : null,
        userId: !orgId ? userId : undefined,
      },
    });

    return {
      userCustomerId: user?.paddleCustomerId,
      organizationBusinessId: organization?.paddleBusinessId,
      organizationCustomerId: organization?.paddleCustomerId,
      subscription: {
        enabled: !!subscription,
        scheduled_change: subscription?.scheduled_change,
        next_billed_at: subscription?.next_billed_at,
      },
    };
  });
}
