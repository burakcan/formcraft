"use server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { endScreen, statement } from "@/lib/craftPageConfig";
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
              statement.parse({
                id: uuid(),
                title: "Welcome to My Form",
                description: "This is a form created with FormCraft.",
                cta: "Let's get started!",
              }),
              endScreen.parse({
                id: uuid(),
                title: "Thank you for completing the form!",
                description: "Your responses have been submitted.",
              }),
            ],
          },
        },
      },
    },
  });

  redirect(`/form/${createdForm.id}/edit`);
}
