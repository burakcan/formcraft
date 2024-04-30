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

export default async function Dashboard() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [craftsListingQueryKey],
    queryFn: async () => {
      try {
        return await getCraftsListing();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

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
