import { useAuth } from "@clerk/nextjs";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import { cn } from "@/lib/utils";
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

export function TryProButton(
  props: Props & {
    className?: string;
    returnPath?: string;
  }
) {
  const { organization, className, returnPath = "/dashboard" } = props;
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
      className={cn(
        "bg-yellow-300 text-black border border-black hover:bg-black hover:text-yellow-300",
        className
      )}
      asChild
    >
      <Link prefetch={false} href={`/checkout?f=${forWhom}&r=${returnPath}`}>
        <BadgeCheckIcon className="size-4 mr-2" />
        {!subscriptionData ? "Try Pro for free" : "Buy Formcraft Pro"}
      </Link>
    </Button>
  );
}
