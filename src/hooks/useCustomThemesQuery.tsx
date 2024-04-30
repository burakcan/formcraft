import type { CustomTheme } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const customThemesQueryKey = "custom-themes";

export function useCustomThemesQuery() {
  return useQuery<{
    data: CustomTheme[];
  }>({
    queryKey: [customThemesQueryKey],
    queryFn: async () => {
      const res = await fetch(`/api/custom-themes`);
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}

export function invalidateCustomThemesQuery(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [customThemesQueryKey],
  });
}

export function addCustomThemeToQuery(
  queryClient: QueryClient,
  theme: CustomTheme
) {
  queryClient.setQueryData<{
    data: CustomTheme[];
  }>([customThemesQueryKey], (data) => {
    if (!data) {
      return { data: [theme] };
    }

    return {
      data: [...data.data.filter((t) => t.id === theme.id), theme],
    };
  });
}

export function removeCustomThemeFromQuery(
  queryClient: QueryClient,
  themeId: string
) {
  queryClient.setQueryData<{
    data: CustomTheme[];
  }>([customThemesQueryKey], (data) => {
    if (!data) {
      return data;
    }

    return {
      data: data.data.filter((t) => t.id !== themeId),
    };
  });
}
