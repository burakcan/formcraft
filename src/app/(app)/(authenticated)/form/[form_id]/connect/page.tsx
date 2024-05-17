import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { CraftConnections } from "@/components/CraftConnections";
import { craftConnectionsQueryKey } from "@/hooks/useCraftConnectionsQuery";
import { getCraftConnections } from "@/services/db/craft";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function CraftConnectPage(props: Props) {
  const { form_id } = props.params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [craftConnectionsQueryKey, form_id],
      queryFn: async () => {
        try {
          return await getCraftConnections(form_id);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LayoutWithTopbar
        topBar={
          <CraftBuilderTopBar
            hideUndoRedo
            craft_id={form_id}
            activeTab="connect"
          />
        }
      >
        <CraftConnections />
      </LayoutWithTopbar>
    </HydrationBoundary>
  );
}
