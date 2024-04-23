import { NextResponse } from "next/server";

export const GET = async () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const imagesToken = process.env.CLOUDFLARE_IMAGES_TOKEN;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`;

  const result = await fetch(url, {
    cache: "no-cache",
    method: "POST",
    headers: {
      Authorization: `Bearer ${imagesToken}`,
    },
  });

  return NextResponse.json(await result.json());
};
