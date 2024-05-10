import "server-only";
import { auth } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { ErrorType } from "@/lib/errors";
import { builtinThemes } from "@/lib/themes";
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

  const id = data.id || nanoid(5);

  if (builtinThemes[id]) {
    throw new Error(ErrorType.Invalid_Request);
  }

  const theme = await db.customTheme.upsert({
    where: {
      id: id,
      userId: !orgId ? userId : undefined,
      organizationId: orgId || undefined,
    },
    create: {
      id: id,
      userId: userId,
      organizationId: orgId || undefined,
      data: {
        ...data,
        id,
      },
    },
    update: {
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

export const deleteCustomTheme = async (themeId: string) => {
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  await db.customTheme.delete({
    where: {
      id: themeId,
      userId: !orgId ? userId : undefined,
      organizationId: orgId || undefined,
    },
  });
};
