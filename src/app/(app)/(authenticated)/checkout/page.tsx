import { auth } from "@clerk/nextjs";
import { RedirectType, redirect } from "next/navigation";
import {
  createCheckoutSession,
  getPriceByLookupKey,
} from "@/services/stripe/server";

interface Props {
  searchParams: {
    f: "u" | "o"; // user or organization
    i?: "m" | "y"; // monthly or yearly
    r?: string; // return path
  };
}

export default async function CheckoutRedirect(props: Props) {
  const authData = auth();
  const { searchParams } = props;
  const returnPath = searchParams?.r || "/dashboard";
  const interval = searchParams.i || "m";

  let owner: { userId: string } | { organizationId: string } | undefined;
  let lookupKey: string | undefined;

  if (searchParams.f === "o" && authData.orgId) {
    owner = { organizationId: authData.orgId };
    lookupKey =
      interval === "m"
        ? "pro_organizations_monthly"
        : "pro_organizations_yearly";
  }

  if (searchParams.f === "u" && authData.userId) {
    owner = { userId: authData.userId };
    lookupKey =
      interval === "m" ? "pro_individual_monthly" : "pro_individual_yearly";
  }

  if (!owner || !lookupKey) {
    redirect("/dashboard", RedirectType.replace);
  }

  const price = await getPriceByLookupKey(lookupKey);

  if (!price) {
    redirect("/dashboard", RedirectType.replace);
  }

  const checkoutSession = await createCheckoutSession(
    owner,
    price.id,
    returnPath
  );

  if (checkoutSession?.url) {
    redirect(checkoutSession.url, RedirectType.replace);
  }

  return null;
}
