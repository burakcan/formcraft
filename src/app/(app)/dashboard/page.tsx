import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { LayoutWithSidebar } from "@/components/AppChrome";
import { CraftListing } from "@/components/CraftListing";
import { ListingSidebar } from "@/components/ListingSidebar";
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
      <LayoutWithSidebar topBar={<Navbar />} left={<ListingSidebar />}>
        <CraftListing />
      </LayoutWithSidebar>
    </HydrationBoundary>
  );
}
