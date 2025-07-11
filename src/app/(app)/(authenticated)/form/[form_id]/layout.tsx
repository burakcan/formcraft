import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { craftQueryKey } from "@/hooks/useCraftQuery";
import { customThemesQueryKey } from "@/hooks/useCustomThemesQuery";
import { getCraftAndEditingVersion } from "@/services/db/craft";
import { getCustomThemes } from "@/services/db/customTheme";
import { Providers } from "./providers";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ form_id: string }> }>
) {
  const { children, params } = props;
  const { form_id } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [craftQueryKey, form_id],
      queryFn: async () => {
        try {
          return await getCraftAndEditingVersion(form_id);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),

    queryClient.prefetchQuery({
      queryKey: [customThemesQueryKey],
      queryFn: async () => {
        try {
          return await getCustomThemes();
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Providers form_id={(await props.params).form_id}>{children}</Providers>
    </HydrationBoundary>
  );
}
