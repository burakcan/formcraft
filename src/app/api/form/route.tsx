import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCraftsListing } from "@/services/db/craft";
import { genericApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const includeArchived = req.nextUrl.searchParams.get("includeArchived");
    const data = await getCraftsListing(includeArchived === "true");

    return NextResponse.json(data);
  } catch (error) {
    return genericApiError(error);
  }
}
