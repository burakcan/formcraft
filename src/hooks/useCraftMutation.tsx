import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { setCraftQueryData } from "./useCraftQuery";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";
import { useEditCraftStore } from "./useEditCraftStore";

export function useCraftMutation() {
  const queryClient = useQueryClient();

  const { craft, editingVersion } = useEditCraftStore(
    ({ craft, editingVersion }) => ({
      craft,
      editingVersion,
    })
  );

  const mutation = useMutation({
    mutationKey: ["craft", craft.id],
    mutationFn: async (publish: boolean) => {
      setCraftQueryData(queryClient, craft.id, {
        craft,
        editingVersion,
      });

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
      invalidateCraftsListingQuery(queryClient);

      setCraftQueryData(queryClient, craft.id, (prev) => {
        return {
          ...prev,
          craft: {
            ...prev.craft,
            unpublishedChanges: response.craft.unpublishedChanges,
            archivedAt: response.craft.archivedAt,
            published: response.craft.published,
          },
          editingVersion: {
            ...prev.editingVersion,
            id: response.version.id,
            publishedAt: response.version.publishedAt,
          },
        };
      });
    },

    scope: {
      id: craft.id,
    },
  });

  return useMemo(
    () => ({
      ...mutation,
    }),
    [mutation]
  );
}
