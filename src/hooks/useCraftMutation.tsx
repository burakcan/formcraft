import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { setCraftQueryData } from "./useCraftQuery";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";
import { useUseEditCraftStore } from "./useEditCraftStore";

export function useCraftMutation(publish: boolean) {
  const queryClient = useQueryClient();
  const { craft, editingVersion, dirty } = useUseEditCraftStore()(
    ({ craft, editingVersion, dirty }) => ({
      craft,
      editingVersion,
      dirty,
    })
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/form/${craft.id}`, {
        method: "PUT",
        body: JSON.stringify({
          craft: craft,
          version: editingVersion,
          publish,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: (response) => {
      setTimeout(() => {
        mutation.reset();
      }, 3000);

      invalidateCraftsListingQuery(queryClient);

      setCraftQueryData(queryClient, craft.id, {
        craft: response.craft,
        editingVersion: response.version,
      });
    },
  });

  return useMemo(
    () => ({
      ...mutation,
      dirty,
    }),
    [mutation, dirty]
  );
}
