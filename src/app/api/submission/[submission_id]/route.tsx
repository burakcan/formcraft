import { NextResponse, type NextRequest } from "next/server";
import { genericApiError } from "@/lib/utils";
import db from "@/services/db";

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
        throw new Error("Submission not found");
      }

      return await tx.craftSubmission.update({
        where: { id: submission_id },
        data: {
          data: {
            ...submission.data,
            ...json,
          },
        },
      });
    });

    return NextResponse.json(result);
  } catch (e) {
    return genericApiError(e);
  }
}
