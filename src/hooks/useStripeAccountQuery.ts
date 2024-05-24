import type { StripeAccount } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useStripeAccountQuery() {
  return useQuery<StripeAccount>({
    queryKey: ["stripe-account"],
    queryFn: async () => {
      const response = await fetch("/api/stripe-payment/account");

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
  });
}
