import { auth } from "@clerk/nextjs/server";
import { RedirectType, redirect } from "next/navigation";
import { createCustomerPortalSession } from "@/services/stripe/server";

interface Props {
  searchParams: Promise<{
    f: "u" | "o"; // user or organization
    r?: string; // return path
  }>;
}

export default async function CheckoutRedirect(props: Props) {
  const authData = auth();
  const searchParams = await props.searchParams;
  const returnPath = searchParams?.r || "/dashboard";

  let owner: { userId: string } | { organizationId: string } | undefined;

  if (searchParams.f === "o" && authData.orgId) {
    owner = { organizationId: authData.orgId };
  }

  if (searchParams.f === "u" && authData.userId) {
    owner = { userId: authData.userId };
  }

  if (!owner) {
    redirect("/dashboard", RedirectType.replace);
  }

  const customerPortalSession = await createCustomerPortalSession(
    owner,
    returnPath
  );

  if (customerPortalSession?.url) {
    redirect(customerPortalSession.url, RedirectType.replace);
  }

  return null;
}
