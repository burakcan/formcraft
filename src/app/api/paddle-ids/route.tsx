import { NextResponse } from "next/server";
import { genericApiError } from "@/lib/utils";
import { getPaddleIds } from "@/services/db/paddle";

export async function GET() {
  try {
    const data = await getPaddleIds();

    return NextResponse.json(data);
  } catch (e) {
    return genericApiError(e);
  }
}
