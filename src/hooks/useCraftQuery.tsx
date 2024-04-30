import type { CraftVersion } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const craftQueryKey = "craft";

export function useCraftQuery(id: string) {
  return useQuery<{
    craft: FormCraft.Craft;
    editingVersion: CraftVersion;
  }>({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryKey: [craftQueryKey, id],
    queryFn: async () => {
      const res = await fetch(`/api/form/${id}`);
      return res.json();
    },
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
    craft: FormCraft.Craft;
    editingVersion: CraftVersion;
  }
) {
  queryClient.setQueryData([craftQueryKey, id], data);
}
