import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextResponse, type NextRequest } from "next/server";
import { getCraft } from "@/services/db/craft";
import { ErrorType } from "@/lib/errors";
import { genericApiError } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ form_id: string }> }
) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.SHEETS_CONNECTOR_CLIENT_ID,
      process.env.SHEETS_CONNECTOR_CLIENT_SECRET,
      process.env.SHEETS_CONNECTOR_REDIRECT_URI
    );

    const authData = auth();
    const { userId, orgId } = authData;
    const { form_id } = (await ctx.params);

    if (!authData || userId === null) {
      throw new Error(ErrorType.Unauthorized);
    }

    const craft = await getCraft(form_id, userId, orgId);

    if (!craft) {
      throw new Error(ErrorType.Not_Found);
    }

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ],
      state: form_id,
    });

    return NextResponse.redirect(url);
  } catch (e) {
    genericApiError(e);
  }
}
