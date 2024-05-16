import { auth } from "@clerk/nextjs";
import type { CraftSubmission, PrismaClient } from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";
import { ErrorType } from "@/lib/errors";
import db from ".";

export async function getCraftWithLiveVersion(formId: string) {
  return db.craft.findUnique({
    where: { id: formId },
    include: {
      craftVersions: {
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function createSubmission(
  formId: string,
  versionId: string,
  tx?: Omit<PrismaClient, ITXClientDenyList>
) {
  return (tx || db).craftSubmission.create({
    data: {
      craftId: formId,
      craftVersionId: versionId,
      data: {},
    },
  });
}

export async function getVersionsFromSubmissionsList(
  submissions: CraftSubmission[]
) {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const versionIds = submissions.map((s) => s.craftVersionId);

  return db.craftVersion.findMany({
    where: {
      id: { in: versionIds },
      craft: {
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listSubmissions<PS extends number | undefined>(
  formId: string,
  page: number,
  pageSize: PS,
  search?: string,
  includePartial?: boolean
) {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const where = {
    craft: {
      id: formId,
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
    },
    data: {
      not: {},
      ...(includePartial ? {} : { path: ["end_screen", "value"] }),
    },
  };

  const allCount = await db.craftSubmission.count({
    where,
  });

  const pageData = await db.craftSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: pageSize ? (page - 1) * pageSize : undefined,
    take: pageSize,
  });

  return {
    page,
    pageSize,
    total: allCount,
    data: pageData,
  };
}
