import { NextResponse, type NextRequest } from "next/server";
import {
  publishSubmissionToEmailQueue,
  publishSubmissionToSheetsQueue,
  publishSubmissionToWebhooksQueue,
} from "@/services/amqp";
import db from "@/services/db";
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
      publishSubmissionToSheetsQueue(submission_id);
    }

    if (craft?.webhookConnectionId && json["end_screen"]?.value) {
      publishSubmissionToWebhooksQueue(submission_id);
    }

    if (craft?.emailConnectionId && json["end_screen"]?.value) {
      publishSubmissionToEmailQueue(submission_id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log("Error in submission/[submission_id]/route.tsx", e);
    return genericApiError(e);
  }
}
