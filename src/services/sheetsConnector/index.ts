import type {
  CraftVersion,
  GoogleSheetsAuthorization,
  PrismaClient,
} from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";
import { google } from "googleapis";
import db from "../db";

function createSerialNum(secondDate: Date) {
  var oneDay = 24 * 60 * 60 * 1000;
  var firstDate = new Date(1899, 11, 30);
  var secondDateMidnight = new Date(
    secondDate.getFullYear(),
    secondDate.getMonth(),
    secondDate.getDate()
  );
  var diff = secondDate.getTime() - secondDateMidnight.getTime();
  var left =
    Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    ) - 1;
  var right = diff / oneDay;
  var result = left + right;
  return result;
}

export async function refreshTokenIfNeeded(
  oauth2Client: InstanceType<typeof google.auth.OAuth2>,
  sheetsAuthorization: GoogleSheetsAuthorization
) {
  const currentTime = Date.now();
  if (
    sheetsAuthorization!.expiry_date &&
    currentTime >= sheetsAuthorization!.expiry_date
  ) {
    const newTokens = await oauth2Client.refreshAccessToken();
    const refreshedTokens = newTokens.credentials;

    if (
      !refreshedTokens ||
      !refreshedTokens.access_token ||
      !refreshedTokens.expiry_date ||
      !refreshedTokens.token_type ||
      !refreshedTokens.scope
    ) {
      throw new Error("Failed to refresh access token");
    }

    await db.googleSheetsAuthorization.update({
      where: { id: sheetsAuthorization!.id },
      data: {
        access_token: refreshedTokens.access_token,
        expiry_date: refreshedTokens.expiry_date,
        token_type: refreshedTokens.token_type,
        scope: refreshedTokens.scope,
      },
    });

    oauth2Client.setCredentials({
      access_token: refreshedTokens.access_token,
      refresh_token:
        refreshedTokens.refresh_token || sheetsAuthorization!.refresh_token,
      expiry_date: refreshedTokens.expiry_date,
      token_type: refreshedTokens.token_type,
      scope: refreshedTokens.scope,
    });
  }
}

export async function getOAuth2Client(
  craftId: string,
  tx: Omit<PrismaClient, ITXClientDenyList> = db
) {
  const craft = await tx.craft.findUnique({
    where: { id: craftId },
    include: {
      googleSheetsConnection: {
        include: { authorization: true },
      },
    },
  });

  const authorization = craft?.googleSheetsConnection?.authorization;

  if (!authorization) {
    throw new Error("Authorization not found");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.SHEETS_CONNECTOR_CLIENT_ID,
    process.env.SHEETS_CONNECTOR_CLIENT_SECRET,
    process.env.SHEETS_CONNECTOR_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: authorization.access_token,
    refresh_token: authorization.refresh_token || "",
    expiry_date: (authorization.expiry_date as unknown as number) || 0,
    token_type: authorization.token_type || "",
    scope: authorization.scope || "",
  });

  await refreshTokenIfNeeded(oauth2Client, authorization);

  return oauth2Client;
}

export async function syncNamedRanges(
  craftId: string,
  tx: Omit<PrismaClient, ITXClientDenyList> = db
) {
  const craft = await tx.craft.findUnique({
    where: { id: craftId },
    include: { googleSheetsConnection: true },
  });

  const connection = craft?.googleSheetsConnection;

  if (!connection) {
    throw new Error("Connection not found");
  }

  const versions = await tx.craftVersion.findMany({
    where: {
      craftId,
      publishedAt: { not: null },
    },
    orderBy: { publishedAt: "asc" },
  });

  const rangeHeaders: Record<string, string> = {
    created_at: "Created At",
  };

  const allPageIds = versions.reduce((acc, v) => {
    v.data.pages
      .filter((p) => p.type !== "end_screen" && p.type !== "statement")
      .forEach((p) => {
        acc.add(p.id);
        rangeHeaders[p.id] = p.title || p.description || "";
      });

    return acc;
  }, new Set<string>(["created_at"]));

  const oauth2Client = await getOAuth2Client(craftId);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });

  const sheet = await sheets.spreadsheets.get({
    spreadsheetId: connection.sheetId,
  });

  const existingNamedRanges = sheet.data.namedRanges || [];

  const missingNamedRanges = Array.from(allPageIds).filter(
    (pageId) => !existingNamedRanges.some((nr) => nr.name === pageId)
  );

  if (missingNamedRanges.length === 0) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: connection.sheetId,
    requestBody: {
      requests: missingNamedRanges.map((pageId, index) => ({
        addNamedRange: {
          namedRange: {
            name: pageId,
            range: {
              sheetId: sheet.data.sheets![0].properties!.sheetId!,
              startRowIndex: 0,
              startColumnIndex: existingNamedRanges.length + index,
              endColumnIndex: existingNamedRanges.length + index + 1,
            },
          },
        },
      })),
    },
  });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: connection.sheetId,
    requestBody: {
      data: missingNamedRanges.map((pageId) => ({
        range: `${pageId}`,
        values: [[rangeHeaders[pageId]]],
      })),
      valueInputOption: "USER_ENTERED",
    },
  });
}

export async function syncAllAnswers(craftId: string) {
  await syncNamedRanges(craftId);

  const [answers, connection, versionsById] = await db.$transaction(
    async (tx) => {
      const craft = await tx.craft.findUnique({
        where: { id: craftId },
        include: { googleSheetsConnection: true },
      });

      const connection = craft?.googleSheetsConnection;

      if (!connection) {
        throw new Error("Connection not found");
      }

      const answers = await tx.craftSubmission.findMany({
        where: { craftId, data: { not: {} } },
      });

      const versionIds = new Set(answers.map((a) => a.craftVersionId));

      const versions = await tx.craftVersion.findMany({
        where: {
          id: { in: Array.from(versionIds) },
        },
      });

      const versionsById = versions.reduce((acc, v) => {
        acc[v.id] = v;
        return acc;
      }, {} as Record<string, CraftVersion>);

      return [answers, connection, versionsById];
    }
  );

  const oauth2Client = await getOAuth2Client(craftId);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const sheet = await sheets.spreadsheets.get({
    spreadsheetId: connection.sheetId,
  });

  const existingNamedRanges = sheet.data.namedRanges || [];

  // Create a mapping of named range names to their column indices
  const namedRangeColumnMap: Record<string, number> = {};
  existingNamedRanges.forEach((nr) => {
    if (nr.range?.startColumnIndex !== undefined && nr.name) {
      namedRangeColumnMap[nr.name] = nr.range.startColumnIndex!;
    }
  });

  const rows = answers.map((answer) => {
    const row: string[] = [];
    Object.keys(namedRangeColumnMap).forEach((name) => {
      const columnIndex = namedRangeColumnMap[name];
      // Ensure the row has enough columns

      if (!answer.data["end_screen"]?.value) {
        // Don't sync partial answers
        return;
      }

      if (name === "created_at") {
        // to
        row[columnIndex] = createSerialNum(answer.createdAt).toString();
        return;
      }

      const page = versionsById[answer.craftVersionId].data.pages.find(
        (p) => p.id === name
      );

      let value =
        (answer.data[name]?.value && String(answer.data[name].value)) || "";

      if (page?.type === "choices") {
        const choice = page.options.find((o) => o.id === value);
        value = choice?.label || "";
      }

      row[columnIndex] = value;
    });
    return row;
  });

  // Update the spreadsheet with the correctly mapped data
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: connection.sheetId,
    requestBody: {
      data: [
        {
          range: `Sheet1!A2`, // Assuming the data should start from the second row
          majorDimension: "ROWS",
          values: rows,
        },
      ],
      valueInputOption: "USER_ENTERED",
    },
  });
}

export async function appendSingleAnswer(
  craftId: string,
  answerId: string,
  tx: Omit<PrismaClient, ITXClientDenyList> = db
) {
  const craft = await tx.craft.findUnique({
    where: { id: craftId },
    include: { googleSheetsConnection: true },
  });

  const connection = craft?.googleSheetsConnection;

  if (!connection) {
    throw new Error("Connection not found");
  }

  const answer = await tx.craftSubmission.findUnique({
    where: { id: answerId },
  });

  if (!answer) {
    throw new Error("Answer not found");
  }

  const version = await tx.craftVersion.findUnique({
    where: { id: answer.craftVersionId },
  });

  const oauth2Client = await getOAuth2Client(craftId);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const sheet = await sheets.spreadsheets.get({
    spreadsheetId: connection.sheetId,
  });

  const existingNamedRanges = sheet.data.namedRanges || [];

  // Create a mapping of named range names to their column indices
  const namedRangeColumnMap: Record<string, number> = {};
  existingNamedRanges.forEach((nr) => {
    if (nr.range?.startColumnIndex !== undefined && nr.name) {
      namedRangeColumnMap[nr.name] = nr.range.startColumnIndex!;
    }
  });

  // Prepare the row for the single answer
  const row: string[] = [];
  Object.keys(namedRangeColumnMap).forEach((name) => {
    const columnIndex = namedRangeColumnMap[name];
    if (name === "created_at") {
      row[columnIndex] = createSerialNum(answer.createdAt).toString();
      return;
    }

    let value =
      (answer.data[name]?.value && String(answer.data[name].value)) || "";

    const page = version?.data.pages.find((p) => p.id === name);

    if (page?.type === "choices") {
      const choice = page.options.find((o) => o.id === value);
      value = choice?.label || "";
    }

    // Ensure the row has enough columns
    row[columnIndex] = value;
  });

  // Append the row to the sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId: connection.sheetId,
    range: `Sheet1`, // Assuming we're appending to the first sheet
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
