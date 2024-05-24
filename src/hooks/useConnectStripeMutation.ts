import { useMutation } from "@tanstack/react-query";
import type Stripe from "stripe";

export function useConnectStripeMutation() {
  const mutation = useMutation<Stripe.AccountLink>({
    mutationFn: async () => {
      const response = await fetch(`/api/stripe-payment/connect`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });

  return mutation;
}
