import "server-only";
import { auth } from "@clerk/nextjs/server";
import { ErrorType } from "@/lib/errors";
import db from ".";

export function getCraft(id: string, userId: string, orgId?: string) {
  return db.craft.findFirst({
    where: {
      id: id,
      organizationId: orgId || null,
      userId: !orgId ? userId : undefined,
    },
    include: {
      craftVersions: {
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          publishedAt: true,
        },
        take: 1,
      },
      _count: {
        select: {
          craftVersions: {
            where: {
              publishedAt: {
                not: null,
              },
            },
          },
        },
      },
    },
  });
}

export function getWorkingCraftVersion(
  id: string,
  userId: string,
  orgId?: string
) {
  return db.craftVersion.findFirst({
    where: {
      craft: {
        id: id,
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCraftAndEditingVersion(craft_id: string) {
  const authData = await auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const craft = await getCraft(craft_id, userId, orgId);
  const editingVersion = await getWorkingCraftVersion(craft_id, userId, orgId);

  if (!editingVersion || !craft) {
    throw new Error(ErrorType.Not_Found);
  }

  return {
    craft: {
      ...craft,
      archived: craft.archivedAt !== null,
      published: craft._count.craftVersions > 0,
      unpublishedChanges: editingVersion.publishedAt === null,
    },
    editingVersion,
  };
}

export async function getCraftConnections(craft_id: string) {
  const authData = await auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const craftWithConnections = await db.craft.findFirst({
    where: {
      id: craft_id,
      organizationId: orgId || null,
      userId: !orgId ? userId : undefined,
    },
    include: {
      emailConnection: {
        select: {
          email: true,
          confirmedAt: true,
        },
      },
      webhookConnection: {
        select: {
          url: true,
          secret: true,
        },
      },
      googleSheetsConnection: {
        select: {
          sheetId: true,
          sheetUrl: true,
        },
      },
    },
  });

  if (!craftWithConnections) {
    throw new Error(ErrorType.Not_Found);
  }

  return {
    email: craftWithConnections.emailConnection,
    webhook: craftWithConnections.webhookConnection,
    googleSheets: craftWithConnections.googleSheetsConnection,
  };
}

export async function getCraftsListing(
  includeArchived: boolean = false
): Promise<{
  data: FormCraft.CraftListingItem[];
}> {
  const authData = await auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const crafts = await db.craft
    .findMany({
      where: {
        organizationId: orgId || null,
        userId: !orgId ? userId : undefined,
        archivedAt: !includeArchived ? null : undefined,
      },
      select: {
        id: true,
        title: true,
        archivedAt: true,

        craftVersions: {
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            publishedAt: true,
          },
          take: 1,
        },

        _count: {
          select: {
            craftSubmissions: {
              where: {
                data: {
                  not: {},
                },
              },
            },
            craftVersions: {
              where: {
                publishedAt: {
                  not: null,
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
    .then((crafts) =>
      crafts.map((craft) => ({
        id: craft.id,
        title: craft.title,
        archived: craft.archivedAt !== null,
        submissionsCount: craft._count.craftSubmissions,
        published: craft._count.craftVersions > 0,
        unpublishedChanges: craft.craftVersions[0]?.publishedAt === null,
      }))
    );

  return {
    data: crafts,
  };
}
