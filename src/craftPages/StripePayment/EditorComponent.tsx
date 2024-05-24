"use client";

import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckIcon } from "lucide-react";
import { useRef } from "react";
import { FaCcStripe } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { StripePayment } from "./schema";

interface Props {
  page: StripePayment;
  onChange: (pageId: string, page: StripePayment) => void;
}

function useStripe() {
  const stripeRef = useRef<Promise<Stripe | null>>();

  if (!stripeRef.current) {
    stripeRef.current = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }

  return stripeRef.current;
}

export function _StripePaymentEditor(
  props: Props & {
    stripe: Promise<Stripe | null>;
  }
) {
  const { page, onChange } = props;

  const priceFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: page.currency,
  });

  return (
    <PageWrapperEditor innerWrapperClassName="max-w-sm">
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="mx-auto p-8 bg-white rounded-md shadow-md">
        <PaymentElement options={{ layout: "tabs" }} />
        <Button className="w-full mt-4" form="payment-form" type="button">
          Pay {priceFormatter.format(page.price ? page.price : 0)}
        </Button>
        <div className="flex justify-center">
          <div className="inline-flex gap-2 border border-indigo-500 mt-2 items-center px-1 text-xs rounded-md">
            <span>Secured by</span>
            <FaCcStripe className="size-8 text-indigo-500" />
          </div>
        </div>
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}

export function StripePaymentEditor(props: Props) {
  const stripe = useStripe();

  if (!stripe) {
    return;
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        mode: "payment",
        amount: 1099,
        currency: "usd",
      }}
    >
      <_StripePaymentEditor {...props} stripe={stripe} />
    </Elements>
  );
}
