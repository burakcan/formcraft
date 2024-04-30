import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { genericApiError } from "@/lib/utils";
import {
  deleteCustomTheme,
  getCustomThemes,
  saveCustomTheme,
} from "@/services/db/customTheme";

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

export async function DELETE(req: NextRequest) {
  try {
    const payload = await req.text();
    await deleteCustomTheme(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    return genericApiError(error);
  }
}
