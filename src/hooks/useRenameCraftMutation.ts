import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCraftQuery } from "./useCraftQuery";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";

export function useRenameCraftMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await fetch(`/api/form/${id}/rename`, {
        method: "POST",
        body: JSON.stringify({ id, title }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    },
    onSuccess: (data, { id }) => {
      invalidateCraftsListingQuery(queryClient);
      invalidateCraftQuery(queryClient, id);
    },
  });

  return mutation;
}
