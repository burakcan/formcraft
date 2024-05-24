"use client";

import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2Icon, CheckIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { FaCcStripe } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type StripePayment } from "./schema";
import { useCheckoutSessionQuery } from "./useCheckoutSessionMutation";

interface Props {
  page: StripePayment;
}

function useStripe(accountId: string | undefined) {
  const stripeRef = useRef<Promise<Stripe | null>>();

  if (!stripeRef.current && accountId) {
    stripeRef.current = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      { stripeAccount: accountId }
    );
  }

  return stripeRef.current;
}

export function _StripePaymentViewer(
  props: Props & {
    stripe: Promise<Stripe | null>;
    sessionData:
      | {
          client_secret: string;
          account_id: string;
          intent: {
            id: string;
            amount: number;
            currency: string;
          };
        }
      | undefined;
  }
) {
  const { page, stripe: stripePromise, sessionData } = props;
  const [paymentBusy, setPaymentBusy] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>();
  const elements = useElements();

  const handlePaymentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const stripe = await stripePromise;

    if (!stripe || !elements) {
      return;
    }

    setPaymentError(undefined);
    setPaymentBusy(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setPaymentBusy(false);

    if (error) {
      setPaymentError(error.message);
      return;
    }

    setPaymentSuccess(true);
    setPaymentError(undefined);
  };

  const priceFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: sessionData?.intent?.currency || "usd",
  });

  return (
    <>
      <form
        id="payment-form"
        onSubmit={handlePaymentSubmit}
        className="hidden"
      />
      <PageWrapperViewer innerWrapperClassName="max-w-sm" page={page}>
        {({ form, formDomId }) => (
          <>
            <BaseContentViewer page={page} />
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => {
                if (
                  field.value?.intentId !== sessionData?.intent.id ||
                  field.value?.paid !== paymentSuccess
                ) {
                  field.onChange({
                    intentId: sessionData?.intent.id,
                    paid: paymentSuccess,
                  });
                }

                return (
                  <>
                    {sessionData?.client_secret && (
                      <div className="mx-auto p-8 mt-4 bg-white rounded-md shadow-md">
                        {paymentError && (
                          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                            {paymentError}
                          </div>
                        )}
                        {paymentSuccess ? (
                          <div className="flex flex-col items-center justify-center">
                            <CheckCircle2Icon className="text-green-500 size-8 mb-4" />
                            <p>Payment successful!</p>
                            <p className="text-sm text-gray-500">
                              Thank you for your payment.
                            </p>
                          </div>
                        ) : (
                          <>
                            <PaymentElement options={{ layout: "tabs" }} />
                            <Button
                              className="w-full mt-4"
                              form="payment-form"
                              type="submit"
                            >
                              {paymentBusy ? (
                                <Loader2Icon className="animate-spin size-4" />
                              ) : (
                                `Pay ${priceFormatter.format(
                                  sessionData.intent.amount / 100
                                )}`
                              )}
                            </Button>
                            <div className="flex justify-center">
                              <div className="inline-flex gap-2 border border-indigo-500 mt-2 items-center px-1 text-xs rounded-md">
                                <span>Secured by</span>
                                <FaCcStripe className="size-8 text-indigo-500" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {fieldState.error && "paid" in fieldState.error && (
                      <FieldValidationErrorViewer>
                        Payment is required to proceed.
                      </FieldValidationErrorViewer>
                    )}
                    {paymentSuccess && (
                      <CtaSectionViewer
                        page={page}
                        icon={CheckIcon}
                        form={formDomId}
                      />
                    )}
                  </>
                );
              }}
            />
          </>
        )}
      </PageWrapperViewer>
    </>
  );
}

export function StripePaymentViewer(props: Props) {
  const { submissionId, pageId } = useViewCraftStore((state) => ({
    submissionId: state.submissionId,
    pageId: state.currentPageId,
  }));
  const { data: sessionData } = useCheckoutSessionQuery(submissionId, pageId);
  const stripe = useStripe(sessionData?.account_id);

  const options = {
    clientSecret: sessionData?.client_secret,
  };

  if (!stripe || !sessionData?.intent || !sessionData?.client_secret) {
    return (
      <PageWrapperViewer innerWrapperClassName="max-w-sm" page={props.page}>
        {() => (
          <div className="mx-auto flex justify-center items-center h-64 p-8 bg-white rounded-md shadow-md">
            <Loader2Icon className="animate-spin size-8" />
          </div>
        )}
      </PageWrapperViewer>
    );
  }

  return (
    <Elements stripe={stripe} options={options}>
      <_StripePaymentViewer
        {...props}
        stripe={stripe}
        sessionData={sessionData}
      />
    </Elements>
  );
}
