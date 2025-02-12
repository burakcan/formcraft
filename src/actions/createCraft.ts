"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/services/db";
import { ErrorType } from "@/lib/errors";
import { getEdgeID, getPageID } from "@/lib/getID";
import { craftPageDefinitions } from "@/craftPages";

export async function createCraft() {
  const authData = await auth();

  if (!authData || authData.userId === null) {
    throw new Error(ErrorType.Unauthorized);
  }

  const welcomePage = craftPageDefinitions.statement.editorSchema.parse({
    id: getPageID(),
    title: "Welcome to My Form",
    description: "This is a form created with FormCraft.",
    cta: "Let's get started!",
  });

  const endScreen = craftPageDefinitions.end_screen.editorSchema.parse({
    id: getPageID(),
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
            defaultTheme: "default",
            pages: [welcomePage],
            end_pages: [endScreen],
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
                  type: "endPage",
                  data: { pageId: endScreen.id },
                  position: { x: 400, y: 100 },
                },
              ],
              edges: [
                {
                  id: getEdgeID(),
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
