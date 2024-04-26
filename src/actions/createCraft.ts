"use server";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { ErrorType } from "@/lib/errors";
import { craftPageDefinitions } from "@/craftPages";
import db from "@/services/db";

export async function createCraft() {
  const authData = auth();

  if (!authData || authData.userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const welcomePage = craftPageDefinitions.statement.editorSchema.parse({
    id: uuid(),
    title: "Welcome to My Form",
    description: "This is a form created with FormCraft.",
    cta: "Let's get started!",
  });

  const endScreen = craftPageDefinitions.end_screen.editorSchema.parse({
    id: uuid(),
    title: "Thank you for completing the form!",
    description: "Your responses have been submitted.",
  });

  const createdForm = await db.craft.create({
    data: {
      title: "My Form",
      userId: authData.userId,
      organizationId: authData.orgId,
      craftVersions: {
        create: {
          data: {
            pages: [welcomePage, endScreen],
            flow: {
              nodes: [
                {
                  id: welcomePage.id,
                  type: "page",
                  data: { pageId: welcomePage.id },
                  position: { x: 100, y: 100 },
                },
                {
                  id: endScreen.id,
                  type: "page",
                  data: { pageId: endScreen.id },
                  position: { x: 400, y: 100 },
                },
              ],
              edges: [
                {
                  id: `edge-${welcomePage.id}-${endScreen.id}`,
                  source: welcomePage.id,
                  sourceHandle: "output",
                  target: endScreen.id,
                  targetHandle: "input",
                  type: "removable",
                },
              ],
              viewport: {
                x: 0,
                y: 0,
                zoom: 1,
              },
            },
          },
        },
      },
    },
  });

  redirect(`/form/${createdForm.id}/edit`);
}
