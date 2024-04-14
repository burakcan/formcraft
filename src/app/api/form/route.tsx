import { NextResponse } from "next/server";
import { genericApiError } from "@/lib/utils";
import { getCraftsListing } from "@/services/db/craft";

export async function GET() {
  try {
    const data = await getCraftsListing();

    return NextResponse.json(data);
  } catch (error) {
    return genericApiError(error);
  }
}
