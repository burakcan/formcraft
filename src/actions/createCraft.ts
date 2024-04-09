"use server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { ErrorType } from "@/lib/errors";
import db from "@/services/db";

export async function createCraft() {
  const authData = auth();

  if (!authData || authData.userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const createdForm = await db.craft.create({
    data: {
      title: "My Form",
      userId: authData.userId,
      organizationId: authData.orgId,
      craftVersions: {
        create: {
          data: {
            pages: [
              {
                _: "_bp_",
                id: uuid(),
                type: "statement",
                title: "Welcome to My Form",
                description: "This is a form created with FormCraft.",
                baseThemeId: "default",
                themeOverride: {},
                cta: "Let's get started!",
              },
            ],
          },
        },
      },
    },
  });

  redirect(`/form/${createdForm.id}/edit`);
}
