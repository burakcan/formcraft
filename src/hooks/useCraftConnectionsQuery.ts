import type { EmailConnection, WebhookConnection } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftConnectionsQueryKey = "craftConnections";

export function useCraftConnectionsQuery(id: string) {
  return useQuery<{
    email: EmailConnection | null;
    webhook: WebhookConnection | null;
  }>({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryKey: [craftConnectionsQueryKey, id],
    queryFn: async () => {
      const res = await fetch(`/api/form/${id}/connections`);
      return res.json();
    },
  });
}

export function invalidateCraftConnectionsQuery(
  queryClient: QueryClient,
  id: string
) {
  queryClient.invalidateQueries({
    queryKey: [craftConnectionsQueryKey, id],
  });
}

export function setCraftConnectionsQueryData(
  queryClient: QueryClient,
  id: string,
  data: {
    email: EmailConnection | null;
    webhook: WebhookConnection | null;
  }
) {
  queryClient.setQueryData([craftConnectionsQueryKey, id], data);
}
