import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { Craft, CraftVersion } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";
import db from "@/services/db";
import { getCraftAndEditingVersion } from "@/services/db/craft";

export async function GET(
  req: NextRequest,
  ctx: {
    params: { form_id: string };
  }
) {
  try {
    return NextResponse.json(
      await getCraftAndEditingVersion(ctx.params.form_id)
    );
  } catch (error) {
    return genericApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  ctx: {
    params: { form_id: string };
  }
) {
  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const json = (await req.json()) as {
      craft: Craft;
      version: CraftVersion;
      publish: boolean;
    };

    const updateExisting = json.publish || !json.version.publishedAt;

    const [craft, version] = await db.$transaction(async (tx) => {
      const updatedCraft = await tx.craft.update({
        where: {
          id: ctx.params.form_id,
          organizationId: orgId || undefined,
          userId: !orgId ? userId : undefined,
          updatedAt: json.craft.updatedAt,
        },
        data: {
          title: json.craft.title,
        },
      });

      const updatedVersion = updateExisting
        ? await tx.craftVersion.update({
            where: { id: json.version.id },
            data: {
              data: json.version.data,
              publishedAt: json.publish ? new Date() : null,
            },
          })
        : await tx.craftVersion.create({
            data: {
              craftId: updatedCraft.id,
              data: json.version.data,
              publishedAt: null,
            },
          });

      return [updatedCraft, updatedVersion];
    });

    return NextResponse.json({
      craft,
      version,
    });
  } catch (error) {
    return genericApiError(error);
  }
}
