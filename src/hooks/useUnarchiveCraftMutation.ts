import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCraftQuery } from "./useCraftQuery";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";

export function useUnarchiveCraftMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (craftId: string) => {
      const response = await fetch(`/api/form/${craftId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    },
    onSuccess: (data, craftId) => {
      invalidateCraftsListingQuery(queryClient);
      invalidateCraftQuery(queryClient, craftId);
    },
  });

  return mutation;
}
