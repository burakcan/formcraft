import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Providers } from "./providers";
import { LayoutWithSidebar } from "@/components/AppChrome";
import {
  ContentSidebar,
  CraftBuilder,
  CraftBuilderTopBar,
  PropertiesSidebar,
} from "@/components/CraftBuilder";
import { craftQueryKey } from "@/hooks/useCraftQuery";
import { getCraftAndEditingVersion } from "@/services/db/craft";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function EditCraftPage(props: Props) {
  const { form_id } = props.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [craftQueryKey, form_id],
    queryFn: async () => {
      try {
        return await getCraftAndEditingVersion(form_id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Providers form_id={form_id}>
        <LayoutWithSidebar
          left={<ContentSidebar />}
          leftClassName="w-64"
          right={<PropertiesSidebar />}
          topBar={<CraftBuilderTopBar craft_id={form_id} activeTab="create" />}
        >
          <CraftBuilder />
        </LayoutWithSidebar>
      </Providers>
    </HydrationBoundary>
  );
}
