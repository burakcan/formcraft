import { useAuth } from "@clerk/nextjs";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import { Button } from "./ui/button";

type Props =
  | {
      user: true;
      organization?: false;
    }
  | {
      user?: false;
      organization: true;
    };

export function TryProButton(props: Props) {
  const { organization } = props;
  const authData = useAuth();
  const { data: subscriptionData, isLoading } = useSubscriptionQuery(
    authData.userId!,
    organization ? authData.orgId || "" : ""
  );
  const forWhom = authData.orgId && organization ? "o" : "u";

  if (isLoading || !authData.isLoaded) {
    return null;
  }

  if (
    subscriptionData?.status === "active" ||
    subscriptionData?.status === "trialing"
  ) {
    return null;
  }

  return (
    <Button
      className="bg-yellow-300 text-black border border-black hover:bg-black hover:text-yellow-300"
      asChild
    >
      <Link prefetch={false} href={`/checkout?f=${forWhom}`}>
        <BadgeCheckIcon className="size-4 mr-2" />
        {!subscriptionData ? "Try Pro for free" : "Buy Formcraft Pro"}
      </Link>
    </Button>
  );
}
