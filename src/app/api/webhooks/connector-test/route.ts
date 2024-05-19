import type { NextRequest } from "next/server";

export function POST(req: NextRequest) {
  console.log("Received webhook", req.body);
  return new Response("OK");
}
