"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef } from "react";
import { CraftNavigationBlockProvider } from "@/components/CraftNavigationBlock";
import { PublishingOverlay } from "@/components/PublishingOverlay";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import {
  EditCraftStoreContext,
  createEditCraftStore,
} from "@/services/store/editCraftStore";

export function Providers(props: PropsWithChildren<{ form_id: string }>) {
  const { form_id } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPageId = searchParams.get("page_id");
  const pathname = usePathname();
  const { data: queryData } = useCraftQuery(form_id);

  useEffect(() => {
    // remove page param from url but keep the rest nextjs14
    if (initialPageId) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page_id");
      router.replace(pathname + "?" + params.toString());
    }
  }, [initialPageId, pathname, router, searchParams]);

  const serverStoreData = useMemo(
    () => ({
      craft: queryData!.craft,
      editingVersion: queryData!.editingVersion,
      selectedPageId:
        initialPageId || queryData!.editingVersion?.data.pages[0].id,
    }),
    [queryData, initialPageId]
  );

  const storeRef = useRef<ReturnType<typeof createEditCraftStore>>(undefined);

  if (!storeRef.current) {
    storeRef.current = createEditCraftStore(serverStoreData);
  }

  useEffect(() => {
    if (!storeRef.current) {
      return;
    }

    storeRef.current.temporal.getState().pause();

    storeRef.current.setState((state) => {
      return {
        ...serverStoreData,
        selectedPageId:
          state.selectedPageId ||
          serverStoreData.editingVersion.data.pages[0].id,
      };
    });

    storeRef.current.temporal.getState().resume();
  }, [serverStoreData]);

  return (
    <EditCraftStoreContext.Provider value={storeRef.current}>
      <CraftNavigationBlockProvider>
        <PublishingOverlay />
        {props.children}
      </CraftNavigationBlockProvider>
    </EditCraftStoreContext.Provider>
  );
}
