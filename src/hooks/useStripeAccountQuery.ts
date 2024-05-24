import { useAuth } from "@clerk/nextjs";
import type { StripeAccount } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useStripeAccountQuery() {
  const authData = useAuth();

  return useQuery<StripeAccount>({
    queryKey: ["stripe-account", authData.userId, authData.orgId],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await fetch("/api/stripe-payment/account");

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
  });
}
