import "server-only";
import { auth } from "@clerk/nextjs";
import { v4 as uuid } from "uuid";
import { ErrorType } from "@/lib/errors";
import db from ".";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export async function getCustomThemes() {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const themes = await db.customTheme.findMany({
    where: {
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
    },
  });

  return {
    data: themes,
  };
}

export async function saveCustomTheme(data: CraftTheme) {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const id = uuid();

  const theme = await db.customTheme.create({
    data: {
      id: id,
      userId: userId,
      organizationId: orgId || undefined,
      data: {
        ...data,
        id,
      },
    },
  });

  return {
    data: theme,
  };
}
