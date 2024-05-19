import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { CraftVersion } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { getCraftAndEditingVersion } from "@/services/db/craft";
import { syncNamedRanges } from "@/services/sheetsConnector";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

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
      craft: FormCraft.Craft;
      version: CraftVersion;
      publish: boolean;
    };

    const updateExisting = json.publish || !json.version.publishedAt;

    const [craft, version] = await db.$transaction(async (tx) => {
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
              craftId: json.craft.id,
              data: json.version.data,
              publishedAt: null,
            },
          });

      const updatedCraft = await tx.craft
        .update({
          where: {
            id: ctx.params.form_id,
            organizationId: orgId || undefined,
            userId: !orgId ? userId : undefined,
          },
          data: {
            title: json.craft.title,
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
        })
        .then((craft) => {
          return {
            ...craft,
            published: craft._count.craftVersions > 0,
            unpublishedChanges: craft.craftVersions[0]?.publishedAt === null,
          };
        });

      return [updatedCraft, updatedVersion];
    });

    if (json.publish && craft.googleSheetsConnectionId) {
      syncNamedRanges(craft.id);
    }

    return NextResponse.json({
      craft,
      version,
    });
  } catch (error) {
    console.log(error);
    return genericApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: { form_id: string } }
) {
  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const result = await db.craft.update({
      select: {
        id: true,
        archivedAt: true,
      },
      where: {
        id: ctx.params.form_id,
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
      data: {
        archivedAt: null,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return genericApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { form_id: string } }
) {
  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const result = await db.craft.update({
      select: {
        id: true,
        archivedAt: true,
      },
      where: {
        id: ctx.params.form_id,
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return genericApiError(error);
  }
}
