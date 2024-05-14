import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const subscriptionQueryKey = "subscriptions";

export function useSubscriptionQuery(
  userId: string,
  organizationId: string = ""
) {
  return useQuery<{
    userCustomerId: string | undefined;
    organizationBusinessId: string | undefined;
    organizationCustomerId: string | undefined;
    subscription: {
      enabled: boolean;
    };
  }>({
    enabled: !!userId,
    queryKey: [subscriptionQueryKey, userId, organizationId],
    queryFn: async () => {
      const res = await fetch("/api/paddle-ids");
      return res.json();
    },
  });
}

export function setSubscriptionEnabled(
  queryClient: QueryClient,
  userId: string,
  organizationId: string = ""
) {
  queryClient.setQueryData(
    [subscriptionQueryKey, userId, organizationId],
    (data: {
      userCustomerId: string | undefined;
      organizationBusinessId: string | undefined;
      organizationCustomerId: string | undefined;
      subscription: {
        enabled: boolean;
      };
    }) => ({
      ...data,
      subscription: {
        ...data.subscription,
        enabled: true,
      },
    })
  );
}
