import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { craftQueryKey } from "@/hooks/useCraftQuery";
import { customThemesQueryKey } from "@/hooks/useCustomThemesQuery";
import { getCraftAndEditingVersion } from "@/services/db/craft";
import { getCustomThemes } from "@/services/db/customTheme";

export default async function Layout(
  props: PropsWithChildren<{ params: { form_id: string } }>
) {
  const { children, params } = props;
  const { form_id } = params;

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
      <Providers form_id={props.params.form_id}>{children}</Providers>
    </HydrationBoundary>
  );
}
