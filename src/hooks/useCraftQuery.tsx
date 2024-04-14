import type { Craft, CraftVersion } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftQueryKey = "craft";

export function useCraftQuery(id: string) {
  return useQuery<{
    craft: Craft;
    editingVersion: CraftVersion;
  }>({
    queryKey: [craftQueryKey, id],
    queryFn: async () => {
      const res = await fetch(`/api/form/${id}`);
      return res.json();
    },
    refetchOnMount: true,
  });
}

export function invalidateCraftQuery(queryClient: QueryClient, id: string) {
  queryClient.invalidateQueries({
    queryKey: [craftQueryKey, id],
  });
}

export function setCraftQueryData(
  queryClient: QueryClient,
  id: string,
  data: {
    craft: Craft;
    editingVersion: CraftVersion;
  }
) {
  queryClient.setQueryData([craftQueryKey, id], data);
}
