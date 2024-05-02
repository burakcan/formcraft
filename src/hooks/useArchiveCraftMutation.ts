import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCraftQuery } from "./useCraftQuery";
import {
  invalidateCraftsListingQuery,
  removeItemFromCraftsListingQuery,
} from "./useCraftsListingQuery";

export function useArchiveCraftMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (craftId: string) => {
      const response = await fetch(`/api/form/${craftId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    },
    onSuccess: (data, craftId) => {
      removeItemFromCraftsListingQuery(queryClient, craftId, false);
      invalidateCraftsListingQuery(queryClient);
      invalidateCraftQuery(queryClient, craftId);
    },
  });

  return mutation;
}
