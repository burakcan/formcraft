import { NextResponse, type NextRequest } from "next/server";

const proxyRequest = async (req: NextRequest, path: string[]) => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const imagesToken = process.env.CLOUDFLARE_IMAGES_TOKEN;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/${path.join(
    "/"
  )}${req.nextUrl.search}`;

  const result = await fetch(url, {
    cache: "no-cache",
    method: req.method,
    headers: {
      Authorization: `Bearer ${imagesToken}`,
    },
  });

  return NextResponse.json(await result.json());
};

export const GET = async (
  req: NextRequest,
  ctx: {
    params: Promise<{ path: string[] }>;
  }
) => {
  const { path } = (await ctx.params);
  return proxyRequest(req, path);
};

export const POST = async (
  req: NextRequest,
  ctx: {
    params: Promise<{ path: string[] }>;
  }
) => {
  const { path } = (await ctx.params);
  return proxyRequest(req, path);
};

export const PUT = async (
  req: NextRequest,
  ctx: {
    params: Promise<{ path: string[] }>;
  }
) => {
  const { path } = (await ctx.params);
  return proxyRequest(req, path);
};

export const DELETE = async (
  req: NextRequest,
  ctx: {
    params: Promise<{ path: string[] }>;
  }
) => {
  const { path } = (await ctx.params);
  return proxyRequest(req, path);
};
