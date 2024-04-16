import type { Craft } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftsListingQueryKey = "crafts-listing";

export function useCraftsListingQuery() {
  return useQuery<{
    data: Craft[];
  }>({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryKey: [craftsListingQueryKey],
    queryFn: async () => {
      const res = await fetch(`/api/form`);
      return res.json();
    },
  });
}

export function invalidateCraftsListingQuery(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [craftsListingQueryKey],
  });
}
