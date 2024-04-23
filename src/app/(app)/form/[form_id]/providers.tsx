"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef } from "react";
import { SavingOverlay } from "@/components/SavingOverlay";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import {
  EditCraftStoreContext,
  createEditCraftStore,
} from "@/services/store/editCraftStore";

export function Providers(props: PropsWithChildren<{ form_id: string }>) {
  const { form_id } = props;
  const { data: queryData } = useCraftQuery(form_id);

  const serverStoreData = useMemo(
    () => ({
      craft: queryData!.craft,
      editingVersion: queryData!.editingVersion,
      selectedPageId: queryData!.editingVersion?.data.pages[0].id,
    }),
    [queryData]
  );

  const storeRef = useRef<ReturnType<typeof createEditCraftStore>>();

  if (!storeRef.current) {
    storeRef.current = createEditCraftStore(serverStoreData);
  }

  useEffect(() => {
    if (!storeRef.current) {
      return;
    }

    storeRef.current.setState((state) => {
      return {
        ...serverStoreData,
        selectedPageId:
          state.selectedPageId ||
          serverStoreData.editingVersion.data.pages[0].id,
      };
    });

    storeRef.current.temporal.getState().clear();
  }, [serverStoreData]);

  return (
    <EditCraftStoreContext.Provider value={storeRef.current}>
      <SavingOverlay />
      {props.children}
    </EditCraftStoreContext.Provider>
  );
}
