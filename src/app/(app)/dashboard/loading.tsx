import { LayoutWithTopbar } from "@/components/AppChrome";
import { CreateCraftButton } from "@/components/CreateCraftButton";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardLoading() {
  return (
    <LayoutWithTopbar topBar={<Navbar />}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your forms</h1>
            <CreateCraftButton />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            <Skeleton className="shadow-sm h-56 rounded bg-background" />
            <Skeleton className="shadow-sm h-56 rounded bg-background" />
            <Skeleton className="shadow-sm h-56 rounded bg-background" />
          </div>
        </div>
      </div>
    </LayoutWithTopbar>
  );
}
