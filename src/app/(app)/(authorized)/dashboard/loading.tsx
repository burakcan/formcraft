"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { LayoutWithTopbar } from "@/components/AppChrome";
import { CreateCraftButton } from "@/components/CreateCraftButton";
import { Navbar } from "@/components/Navbar";

function ArchivedSwitch() {
  const showArchived = useSearchParams().get("showArchived") === "true";
  return <Switch id="show-archived" checked={showArchived} />;
}

export default function DashboardLoading() {
  return (
    <LayoutWithTopbar topBar={<Navbar />}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Your forms</h1>
            <div className="flex-auto" />
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-archived">Show archived</Label>
              <Suspense>
                <ArchivedSwitch />
              </Suspense>
            </div>
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
