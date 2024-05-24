import "server-only";
import { auth } from "@clerk/nextjs/server";
import { ErrorType } from "@/lib/errors";
import { getThemeID } from "@/lib/getID";
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
      organizationId: orgId || null,
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

  const id = data.id || getThemeID();

  if (builtinThemes[id]) {
    throw new Error(ErrorType.Invalid_Request);
  }

  const theme = await db.customTheme.upsert({
    where: {
      id: id,
      userId: !orgId ? userId : undefined,
      organizationId: orgId || null,
    },
    create: {
      id: id,
      userId: userId,
      organizationId: orgId || null,
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
      organizationId: orgId || null,
    },
  });
};
