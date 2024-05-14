import { useOrganization, useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";

interface Props {
  for: "organization" | "user";
}

export default function Billing(props: Props) {
  const { for: forWhom } = props;
  const { organization, isLoaded: isOrganizationLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: subscriptionData, isPlaceholderData } = useSubscriptionQuery(
    user?.id || "",
    forWhom === "organization" ? organization?.id : undefined
  );

  const isLoading =
    !isOrganizationLoaded ||
    !isUserLoaded ||
    !subscriptionData ||
    isPlaceholderData;

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className=" text-[2rem] leading-[1.5] font-semibold">Billing</h1>
        <p className="text-black/65 text-[1rem] leading-[1.25]">
          Manage your subscription and billing information
        </p>
      </div>

      {isLoading && (
        <div>
          <Loader2Icon className="animate-spin w-8 h-8 text-accent m-8" />
        </div>
      )}

      {!isLoading && subscriptionData.subscription.enabled && (
        <>
          <div className="my-8 rounded bg-background border shadow-md p-4">
            <h2>
              <span className="text-[1.25rem] font-semibold">Subscription</span>
            </h2>
            <p className="text-black/65 text-[1rem] leading-[1.25] mt-2 mb-6">
              You are currently on the{" "}
              <strong>
                {forWhom === "organization"
                  ? "Pro for organizations"
                  : "Pro for individuals"}
              </strong>{" "}
              plan. Your next billing date is{" "}
              <span className="font-semibold">April 1, 2022</span>.
            </p>
            <Button variant="secondary">Cancel subscription</Button>
          </div>

          <div className="my-8 rounded bg-background border shadow-md p-4">
            <h2>
              <span className="text-[1.25rem] font-semibold">
                Payment method
              </span>
            </h2>
            <p className="text-black/65 text-[1rem] leading-[1.25] mt-2 mb-6">
              Your current payment method is ending in 1234.
            </p>
            <Button variant="secondary">Update payment method</Button>
          </div>

          <div className="my-8 rounded bg-background border shadow-md p-4">
            <h2>
              <span className="text-[1.25rem] font-semibold">
                Billing history
              </span>
            </h2>
            <p className="text-black/65 text-[1rem] leading-[1.25] mt-2 mb-6">
              Your billing history is empty.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
