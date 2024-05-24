import { useQuery } from "@tanstack/react-query";

export function useCheckoutSessionQuery(
  submissionId?: string,
  pageId?: string
) {
  return useQuery<{
    client_secret: string;
    account_id: string;
    intent: {
      id: string;
      amount: number;
      currency: string;
    };
  }>({
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!submissionId && !!pageId,
    queryKey: ["checkout-session", submissionId, pageId],
    retry: false,
    queryFn: async () => {
      if (!submissionId) {
        return;
      }

      const res = await fetch(
        `/api/submission/${submissionId}/checkout-session?pageId=${pageId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch checkout session");
      }

      return res.json();
    },
  });
}
