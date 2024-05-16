import { NextResponse, type NextRequest } from "next/server";
import db from "@/services/db";
import { appendSingleAnswer } from "@/services/sheetsConnector";
import { genericApiError } from "@/lib/utils";

export async function GET() {}

export async function POST() {}

export async function PUT(
  req: NextRequest,
  ctx: {
    params: {
      submission_id: string;
    };
  }
) {
  try {
    const json = (await req.json()) as FormCraft.CraftSubmissionData;
    const { submission_id } = ctx.params;

    const result = await db.$transaction(async (tx) => {
      const submission = await tx.craftSubmission.findUnique({
        where: { id: submission_id },
        select: { data: true },
      });

      if (!submission) {
        console.log("Submission not found", submission_id);
        throw new Error("Submission not found");
      }

      const updatedSubmission = await tx.craftSubmission.update({
        where: { id: submission_id },
        data: {
          data: {
            ...submission.data,
            ...json,
          },
        },
      });

      if (submission.data["end_screen"]?.value) {
        const craft = await tx.craft.findUnique({
          where: { id: updatedSubmission.craftId },
          select: { googleSheetsConnectionId: true },
        });

        if (craft?.googleSheetsConnectionId) {
          await appendSingleAnswer(
            updatedSubmission.craftId,
            updatedSubmission.id,
            tx
          );
        }
      }

      return updatedSubmission;
    });

    return NextResponse.json(result);
  } catch (e) {
    console.log("Error in submission/[submission_id]/route.tsx", e);
    return genericApiError(e);
  }
}
