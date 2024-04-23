import type { Craft, CraftVersion } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const uploadUrlQueryKey = "upload_url";

export function useUploadUrlQuery() {
  return useQuery<{
    craft: Craft;
    editingVersion: CraftVersion;
  }>({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryKey: [uploadUrlQueryKey],
    enabled: true,
    queryFn: async () => {
      const res = await fetch(`/api/upload_url`);
      return res.json();
    },
  });
}

export function invalidateCraftQuery(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [uploadUrlQueryKey],
  });
}
