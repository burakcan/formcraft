import type { Craft } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftsListingQueryKey = "crafts-listing";

export function useCraftsListingQuery() {
  return useQuery<{
    data: Craft[];
  }>({
    queryKey: [craftsListingQueryKey],
    queryFn: async () => {
      const res = await fetch(`/api/form`);
      return res.json();
    },
    refetchOnMount: true,
  });
}

export function invalidateCraftsListingQuery(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [craftsListingQueryKey],
  });
}
