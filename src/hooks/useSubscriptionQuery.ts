import type { StripeSubscription } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useSubscriptionQuery(userId: string, orgId?: string) {
  return useQuery<StripeSubscription | null>({
    enabled: !!userId,
    queryKey: ["subscription", userId, orgId || ""],
    queryFn: async () => {
      const response = await fetch(`/api/subscription?f=${orgId ? "o" : "u"}`);

      if (!response.ok) {
        throw new Error("An error occurred while fetching subscription data");
      }

      return response.json();
    },
  });
}
