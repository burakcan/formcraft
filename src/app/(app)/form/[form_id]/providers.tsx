"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import type { EditCraftStore } from "@/services/store/editCraftStore";
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
      dirty: false,
    }),
    [queryData]
  );

  const storeRef = useRef<UseBoundStore<StoreApi<EditCraftStore>>>();

  if (!storeRef.current) {
    storeRef.current = createEditCraftStore(serverStoreData);
  }

  const store = storeRef.current;

  useEffect(() => {
    store.setState((state) => {
      return {
        ...serverStoreData,
        selectedPageId:
          state.selectedPageId ||
          serverStoreData.editingVersion.data.pages[0].id,
      };
    });
  }, [serverStoreData, store]);

  return (
    <EditCraftStoreContext.Provider value={store}>
      {props.children}
    </EditCraftStoreContext.Provider>
  );
}
