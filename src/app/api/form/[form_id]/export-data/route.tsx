import { uniqBy } from "lodash";
import { type NextRequest } from "next/server";
import { genericApiError } from "@/lib/utils";
import db from "@/services/db";
import {
  getVersionsFromSubmissionsList,
  listSubmissions,
} from "@/services/db/submission";

export async function GET(
  req: NextRequest,
  ctx: {
    params: { form_id: string };
  }
) {
  try {
    const { form_id } = ctx.params;
    const includePartial = req.nextUrl.searchParams.get("partial") === "true";

    const [data, versions] = await db.$transaction(async (tx) => {
      const data = await listSubmissions(
        form_id,
        1,
        99999999,
        "",
        includePartial,
        tx
      );

      const versions = await getVersionsFromSubmissionsList(data.data, tx);

      return [data, versions];
    });

    const allVersionPages = versions.reduce((acc, v) => {
      return [
        ...acc,
        ...v.data.pages.filter(
          (p) => p.type !== "statement" && p.type !== "end_screen"
        ),
      ];
    }, [] as FormCraft.CraftPage[]);

    const uniquePages = uniqBy(allVersionPages, (p) => p.id);

    const columns = [
      {
        id: "submitted_at",
        header: "Submitted At",
      },
      {
        id: "is_partial",
        header: "Partial",
      },
      ...uniquePages.map((p) => ({
        id: p.id,
        header: p.title || p.description || "",
      })),
    ];

    const csvData = data.data.map((submission) => {
      const row: Record<string, string | boolean | number> = {
        id: submission.id,
        submitted_at: submission.updatedAt.toJSON(),
        is_partial: submission.data["end_screen"]?.value ? "true" : "false",
      };

      columns.forEach((col) => {
        row[col.header] = row[col.id] || submission.data[col.id]?.value || "";
      });

      return row;
    });

    const csv = columns.map((col) => col.header).join(",") + "\n";
    const csvRows = csvData.map((row) =>
      columns.map((col) => row[col.header]).join(",")
    );

    const csvString = csv + csvRows.join("\n");

    return new Response(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${form_id}_answers.csv"`,
      },
    });
  } catch (error) {
    return genericApiError(error);
  }
}
