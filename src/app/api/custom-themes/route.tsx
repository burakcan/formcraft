import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { genericApiError } from "@/lib/utils";
import { getCustomThemes, saveCustomTheme } from "@/services/db/customTheme";

export async function GET() {
  try {
    const data = await getCustomThemes();

    return NextResponse.json(data);
  } catch (error) {
    return genericApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const data = await saveCustomTheme(payload);

    return NextResponse.json(data);
  } catch (error) {
    return genericApiError(error);
  }
}
