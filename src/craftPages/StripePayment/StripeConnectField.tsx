"use client";

import { Loader2 } from "lucide-react";
import { FaStripe } from "react-icons/fa";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStripeAccountQuery } from "@/hooks/useStripeAccountQuery";
import { InputGroup } from "../contentAtoms/InputGroup";
import { ConnectButton } from "./ConnectButton";

export function StripeConnectField() {
  const {
    data: stripeAccount,
    isLoading: stripeAccountLoading,
    isRefetching: stripeAccountRefetching,
    refetch: refetchStripeAccount,
  } = useStripeAccountQuery();

  const isIncomplete = stripeAccount && stripeAccount.charges_enabled === false;

  return (
    <InputGroup>
      {stripeAccountLoading || stripeAccountRefetching ? (
        <div className="flex items-center justify-center">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : stripeAccount && !isIncomplete ? (
        <div>
          <Label>
            Connected to{" "}
            <FaStripe className="size-9 ml-1 text-indigo-500 inline-block" />
          </Label>
          <div className="flex justify-between items-center space-x-2">
            <Input className="flex-auto" value={stripeAccount.id} readOnly />
          </div>
        </div>
      ) : (
        <>
          {isIncomplete ? (
            <Alert variant="destructive">
              <AlertDescription>
                Stripe requires additional information to enable charges. Please
                complete your account setup to receive payments.
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-gray-500">
              Connect to a Stripe account to receive payments.
            </p>
          )}
          <ConnectButton refetchStripeAccount={refetchStripeAccount} />
        </>
      )}
    </InputGroup>
  );
}
