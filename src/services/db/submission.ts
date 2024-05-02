import type { PrismaClient } from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";
import db from ".";

export async function getCraftWithLiveVersion(
  formId: string,
  tx?: Omit<PrismaClient, ITXClientDenyList>
) {
  return (tx || db).craft.findUnique({
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
