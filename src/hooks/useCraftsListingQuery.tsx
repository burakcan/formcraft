import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftsListingQueryKey = "crafts-listing";

export function useCraftsListingQuery(includeArchived: boolean = false) {
  return useQuery<{
    data: FormCraft.CraftListingItem[];
  }>({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryKey: [craftsListingQueryKey, includeArchived],
    queryFn: async () => {
      const res = await fetch(`/api/form?includeArchived=${includeArchived}`);
      return res.json();
    },
  });
}

export function invalidateCraftsListingQuery(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [craftsListingQueryKey],
  });
}

export function removeItemFromCraftsListingQuery(
  queryClient: QueryClient,
  id: string,
  includeArchived: boolean = false
) {
  queryClient.setQueryData(
    [craftsListingQueryKey, includeArchived],
    (oldData: { data: FormCraft.CraftListingItem[] }) => {
      return {
        data: oldData.data.filter((item) => item.id !== id),
      };
    }
  );
}
