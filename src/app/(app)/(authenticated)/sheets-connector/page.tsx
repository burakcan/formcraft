"use server";

import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { RedirectType, redirect } from "next/navigation";
import db from "@/services/db";
import { getCraft } from "@/services/db/craft";
import {
  refreshTokenIfNeeded,
  syncAllAnswers,
} from "@/services/sheetsConnector";
import { ErrorType } from "@/lib/errors";

interface Props {
  searchParams: { code: string; state: string };
}

export default async function SheetsConnectorPage(props: Props) {
  const { code, state: craftId } = props.searchParams;
  const authData = auth();
  const { userId, orgId } = authData;

  if (!authData || userId === null) {
    console.log("Unauthorized");
    throw new Error(ErrorType.Unauthorized);
  }

  if (!code) {
    console.log("No code provided");
    return redirect(
      `/form/${craftId}/connect?sheetsConnected=false`,
      RedirectType.replace
    );
  }

  console.log("Proceed to create oauth2Client", userId);

  const oauth2Client = new google.auth.OAuth2(
    process.env.SHEETS_CONNECTOR_CLIENT_ID,
    process.env.SHEETS_CONNECTOR_CLIENT_SECRET,
    process.env.SHEETS_CONNECTOR_REDIRECT_URI
  );

  console.log("Created oauth2client", userId);
  console.log("Getting tokens", userId);

  const { tokens } = await oauth2Client.getToken(code);

  console.log("Finished getting tokens", userId);

  if (!tokens || !tokens.access_token || !tokens.id_token) {
    console.log("No tokens provided", userId);
    throw new Error(ErrorType.Unauthorized);
  }

  console.log("Verifying id token", userId);

  const loginTicket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.SHEETS_CONNECTOR_CLIENT_ID,
  });

  console.log("Finished verifying id token", userId);

  const googleUserId = loginTicket.getUserId();

  console.log("Google user id", googleUserId);

  if (!googleUserId) {
    console.log("No google user id", userId);
    throw new Error(ErrorType.Unauthorized);
  }

  console.log("Finding sheets authorization", userId);

  let sheetsAuthorization = await db.googleSheetsAuthorization.findFirst({
    where: {
      id_token: googleUserId,
    },
  });

  if (!sheetsAuthorization) {
    console.log("Creating sheets authorization", userId);
    sheetsAuthorization = await db.googleSheetsAuthorization.create({
      data: {
        id_token: googleUserId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || "",
        expiry_date: tokens.expiry_date || 0,
        token_type: tokens.token_type || "",
        scope: tokens.scope || "",
      },
    });
  }

  console.log("Setting credentials", userId);

  oauth2Client.setCredentials({
    access_token: sheetsAuthorization.access_token,
    refresh_token: sheetsAuthorization.refresh_token || "",
    expiry_date: (sheetsAuthorization.expiry_date as unknown as number) || 0,
    token_type: sheetsAuthorization.token_type || "",
    scope: sheetsAuthorization.scope || "",
  });

  console.log("Refreshing token if needed", userId);

  await refreshTokenIfNeeded(oauth2Client, sheetsAuthorization);

  console.log("Getting craft", userId);

  const craft = await getCraft(craftId, userId, orgId);

  if (!craft) {
    console.log("Craft not found", userId);
    throw new Error(ErrorType.Not_Found);
  }

  console.log("Creating sheet client", userId);

  const sheetsClient = google.sheets({
    version: "v4",
    auth: oauth2Client,
  });

  console.log("Creating sheet", userId);

  const sheet = await sheetsClient.spreadsheets.create({
    requestBody: {
      properties: { title: craft?.title || "Untitled" },
    },
  });

  if (!sheet.data.spreadsheetId) {
    console.log("No spreadsheet id", userId);
    throw new Error(ErrorType.Unauthorized);
  }

  console.log("Updating craft", userId);

  await db.craft.update({
    where: {
      id: craftId,
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
    },
    data: {
      googleSheetsConnection: {
        create: {
          sheetId: sheet.data.spreadsheetId,
          sheetUrl: sheet.data.spreadsheetUrl || "",
          authorization: {
            connect: {
              id: sheetsAuthorization.id,
            },
          },
        },
      },
    },
  });

  console.log("Syncing all answers", userId);

  syncAllAnswers(craftId);

  console.log("Everything succeeded", userId);

  return redirect(
    `/form/${craftId}/connect?sheetsConnected=true`,
    RedirectType.replace
  );
}
