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

    const submission = await db.craftSubmission.findUnique({
      where: { id: submission_id },
      select: { data: true },
    });

    if (!submission) {
      console.log("Submission not found", submission_id);
      throw new Error("Submission not found");
    }

    const updatedSubmission = await db.craftSubmission.update({
      where: { id: submission_id },
      include: { craft: true },
      data: {
        data: {
          ...submission.data,
          ...json,
        },
      },
    });

    const craft = updatedSubmission.craft;

    if (craft?.googleSheetsConnectionId && json["end_screen"]?.value) {
      await appendSingleAnswer(updatedSubmission.craftId, updatedSubmission.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log("Error in submission/[submission_id]/route.tsx", e);
    return genericApiError(e);
  }
}
