import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftListing } from "@/components/CraftListing";
import { Navbar } from "@/components/Navbar";
import { craftsListingQueryKey } from "@/hooks/useCraftsListingQuery";
import { getCraftsListing } from "@/services/db/craft";

interface Props {
  searchParams: Promise<{
    showArchived?: string;
  }>;
}

export default async function Dashboard(props: Props) {
  const { showArchived } = await props.searchParams;
  const includeArchived = showArchived === "true";
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [craftsListingQueryKey, includeArchived],
      queryFn: async () => {
        try {
          return await getCraftsListing(includeArchived);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LayoutWithTopbar topBar={<Navbar />}>
        <div className="flex-1 overflow-y-auto">
          <CraftListing />
        </div>
      </LayoutWithTopbar>
    </HydrationBoundary>
  );
}
