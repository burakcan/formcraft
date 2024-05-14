import "server-only";
import { auth } from "@clerk/nextjs";
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

    return {
      userCustomerId: user?.paddleCustomerId,
      organizationBusinessId: organization?.paddleBusinessId,
      organizationCustomerId: organization?.paddleCustomerId,
    };
  });
}
