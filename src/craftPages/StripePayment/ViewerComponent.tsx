"use client";

import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckCircle2Icon,
  CheckIcon,
  CircleAlertIcon,
  Loader2Icon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { FaCcStripe } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  if (!stripeRef.current && accountId && accountId !== "preview") {
    stripeRef.current = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      { stripeAccount: accountId }
    );
  } else if (!stripeRef.current && accountId === "preview") {
    stripeRef.current = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
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
                            {page.collectAddress && (
                              <AddressElement
                                className="mb-1"
                                options={{
                                  mode: "billing",
                                  display: {
                                    name: "full",
                                  },
                                }}
                                onChange={() => {
                                  window.dispatchEvent(new Event("resize"));
                                }}
                              />
                            )}
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
                    {(paymentSuccess || !page.required) && (
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

function StripePaymentPreview(
  props: Props & {
    sessionData: {
      client_secret: string;
      account_id: string;
      intent: {
        id: string;
        amount: number;
        currency: string;
      };
    };
  }
) {
  const { page, sessionData } = props;
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>();

  const priceFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: page.currency || "usd",
  });

  return (
    <>
      <PageWrapperViewer innerWrapperClassName="max-w-sm" page={page}>
        {({ form, formDomId }) => (
          <>
            <BaseContentViewer page={page} />
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => {
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
                            {page.collectAddress && (
                              <AddressElement
                                className="mb-1"
                                options={{
                                  mode: "billing",
                                  display: {
                                    name: "full",
                                  },
                                }}
                              />
                            )}
                            <PaymentElement options={{ layout: "tabs" }} />
                            <Button
                              className="w-full mt-4"
                              form="payment-form"
                              type="button"
                              onClick={() => {
                                field.onChange({
                                  intentId: sessionData?.intent.id,
                                  paid: true,
                                });

                                setPaymentError(undefined);
                                setPaymentSuccess(true);
                              }}
                            >
                              Pay $
                              {priceFormatter.format(
                                sessionData.intent.amount / 100
                              )}{" "}
                              (simulate success)
                            </Button>
                            <Button
                              className="w-full mt-4"
                              form="payment-form"
                              type="button"
                              onClick={() => {
                                field.onChange({
                                  intentId: sessionData?.intent.id,
                                  paid: false,
                                });

                                setPaymentError("This is a simulated error.");
                                setPaymentSuccess(false);
                              }}
                            >
                              Pay $
                              {priceFormatter.format(
                                sessionData.intent.amount / 100
                              )}{" "}
                              (simulate payment issue)
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
                    {(paymentSuccess || !page.required) && (
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
  const { data: sessionData, error } = useCheckoutSessionQuery(
    submissionId,
    pageId
  );
  const stripe = useStripe(submissionId ? sessionData?.account_id : "preview");

  const options = {
    clientSecret: sessionData?.client_secret,
  };

  if (error) {
    return (
      <PageWrapperViewer innerWrapperClassName="max-w-sm" page={props.page}>
        {() => (
          <Alert variant="destructive" className="bg-background shadow-md">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while trying to show the payment form. Please
              try again later.
            </AlertDescription>
          </Alert>
        )}
      </PageWrapperViewer>
    );
  }

  if (!submissionId && stripe) {
    return (
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          amount: 1099,
          currency: "usd",
        }}
      >
        <StripePaymentPreview
          {...props}
          sessionData={{
            client_secret: nanoid(5),
            account_id: nanoid(5),
            intent: {
              id: nanoid(5),
              amount: 100,
              currency: "usd",
            },
          }}
        />
      </Elements>
    );
  }

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
