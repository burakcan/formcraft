import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: {
    params: { path: string[] };
  }
) => {
  const { path } = ctx.params;

  const url = `https://api.unsplash.com/${path.join("/")}${
    req.nextUrl.search
  }&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  const result = await fetch(url);

  return NextResponse.json(await result.json());
};
