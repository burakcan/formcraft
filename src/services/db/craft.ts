import "server-only";
import { auth } from "@clerk/nextjs";
import { ErrorType } from "@/lib/errors";
import db from ".";

export function getCraft(id: string, userId: string, orgId?: string) {
  return db.craft.findFirst({
    where: {
      id: id,
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
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
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCraftAndEditingVersion(craft_id: string) {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const [craft, editingVersion] = await db.$transaction([
    getCraft(craft_id, userId, orgId),
    getWorkingCraftVersion(craft_id, userId, orgId),
  ]);

  if (!editingVersion || !craft) {
    throw new Error(ErrorType.Not_Found);
  }

  return {
    craft,
    editingVersion,
  };
}

export async function getCraftConnections(craft_id: string) {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const craftWithConnections = await db.craft.findFirst({
    where: {
      id: craft_id,
      organizationId: orgId || undefined,
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

export async function getCraftsListing() {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const crafts = await db.craft.findMany({
    where: {
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    data: crafts,
  };
}
