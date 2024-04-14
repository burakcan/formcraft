import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { useStore } from "zustand";
import { setCraftQueryData } from "./useCraftQuery";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function useCraftMutation(publish: boolean) {
  const ctx = useContext(EditCraftStoreContext);
  const queryClient = useQueryClient();

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { editingVersion, craft } = store;

  if (!craft || !editingVersion) {
    throw new Error("Craft or editingVersion is not provided");
  }

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
      dirty: store.dirty,
    }),
    [mutation, store.dirty]
  );
}
