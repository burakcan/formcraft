import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCustomThemeFromQuery } from "./useCustomThemesQuery";

export function useDeleteCustomThemeMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: async (themeId) => {
      const response = await fetch(`/api/custom-themes`, {
        method: "DELETE",
        body: themeId,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return void 0;
    },
    onSuccess: (response, themeId) => {
      removeCustomThemeFromQuery(queryClient, themeId);
    },
  });

  return mutation;
}
