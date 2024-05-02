import type { CustomTheme } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCustomThemesQuery } from "./useCustomThemesQuery";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export function useSaveCustomThemeMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ data: CustomTheme }, Error, CraftTheme>({
    mutationFn: async (theme) => {
      const response = await fetch(`/api/custom-themes`, {
        method: "POST",
        body: JSON.stringify(theme),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: () => {
      invalidateCustomThemesQuery(queryClient);
    },
  });

  return mutation;
}
