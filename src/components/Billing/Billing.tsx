import { useAuth } from "@clerk/nextjs";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import { TryProButton } from "../TryProButton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props =
  | {
      user: true;
      organization?: false;
    }
  | {
      user?: false;
      organization: true;
    };

export default function Billing(props: Props) {
  const authData = useAuth();
  const { user, organization } = props;
  const { data: subscription } = useSubscriptionQuery(
    authData.userId!,
    organization ? authData.orgId || "" : ""
  );

  const activeOrTrialing =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  const notActive =
    !subscription ||
    (subscription.status !== "active" && subscription.status !== "trialing");

  const hadSubscriptionBefore =
    subscription &&
    subscription.status !== "active" &&
    subscription.status !== "trialing";

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className=" text-[1.0625rem] leading-[1.41176] font-bold">
          Billing
        </h1>
        <div className="mt-3 mb-2 border-t border-[rgba(0,0,0,0.07)]"></div>

        {user && authData.orgId && (
          <Alert className="mt-4">
            <TriangleAlert className="size-5" />
            <AlertTitle>
              You are viewing your personal billing information
            </AlertTitle>
            <AlertDescription>
              To view your organization&apos;s billing information, go to
              organization settings using the organization switcher.
            </AlertDescription>
          </Alert>
        )}

        {activeOrTrialing && (
          <Alert className="mt-4">
            <AlertTitle className="flex items-center">
              Formcraft Pro {organization ? "Organization" : ""}
              <Badge className="bg-emerald-500 text-emerald-900 pointer-events-none ml-2">
                {subscription.status === "trialing" && "Free trial"}
                {subscription.status === "active" && "Active"}
              </Badge>
            </AlertTitle>
            <AlertDescription>
              {subscription.status === "trialing"
                ? `Your free trial will end on ${new Date(
                    subscription.trial_end as unknown as string
                  ).toLocaleString()}`
                : `Your subscription will renew on ${new Date(
                    subscription.current_period_end as unknown as string
                  ).toLocaleString()}`}
              <div className="mt-2 flex">
                <Button variant="outline" asChild>
                  <Link
                    prefetch={false}
                    href={`/customer-portal?f=${organization ? "o" : "u"}`}
                  >
                    Manage subscription
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {notActive && (
          <Alert className="mt-4">
            <AlertTitle>No active subscription</AlertTitle>
            <AlertDescription>
              You don&apos;t have an active subscription. Subscribe now to
              access Formcraft Pro features!
              <div className="mt-2 flex gap-2">
                <TryProButton {...props} />
                {hadSubscriptionBefore && (
                  <Button variant="outline" asChild>
                    <Link
                      prefetch={false}
                      href={`/customer-portal?f=${organization ? "o" : "u"}`}
                    >
                      Manage billing information
                    </Link>
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
