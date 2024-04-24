"use server";
import { auth } from "@clerk/nextjs";
import { google } from "googleapis";
import { RedirectType, redirect } from "next/navigation";
import { ErrorType } from "@/lib/errors";
import db from "@/services/db";

export default async function Page(props: {
  searchParams: { code: string; state: string };
}) {
  const { code, state } = props.searchParams;

  const ouath2Client = new google.auth.OAuth2(
    process.env.SHEETS_CONNECTOR_CLIENT_ID,
    process.env.SHEETS_CONNECTOR_CLIENT_SECRET,
    process.env.SHEETS_CONNECTOR_REDIRECT_URI
  );

  try {
    const authData = auth();
    const { userId, orgId } = authData;

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const craft = await db.craft.findFirst({
      where: {
        id: state,
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
    });

    const { tokens } = await ouath2Client.getToken(code);

    if (!tokens || !tokens.access_token || !tokens.refresh_token) {
      throw new Error(ErrorType.Unauthorized);
    }

    ouath2Client.setCredentials(tokens);

    const sheetsClient = google.sheets({
      version: "v4",
      auth: ouath2Client,
    });

    const sheet = await sheetsClient.spreadsheets.create({
      requestBody: {
        properties: {
          title: craft?.title || "Untitled",
        },
      },
    });

    if (!sheet.data.spreadsheetId) {
      throw new Error(ErrorType.Unauthorized);
    }

    await db.craft.update({
      where: {
        id: state,
        organizationId: orgId || undefined,
        userId: !orgId ? userId : undefined,
      },
      data: {
        googleSheetsConnection: {
          create: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope || "",
            token_type: tokens.token_type || "",
            expiry_date: tokens.expiry_date || 0,
            sheetId: sheet.data.spreadsheetId,
            sheetUrl: sheet.data.spreadsheetUrl || "",
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  return redirect(`/form/${state}/connect`, RedirectType.replace);
}
