"use client";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useCraftQuery } from "@/hooks/useCraftQuery";
import {
  EditCraftStoreContext,
  createEditCraftStore,
} from "@/services/store/editCraftStore";

interface Props {
  form_id: string;
}

export function Providers(props: PropsWithChildren<Props>) {
  const { form_id } = props;
  const { data } = useCraftQuery(form_id);

  const initialData = useMemo(
    () => ({
      craft: data!.craft,
      editingVersion: data!.editingVersion,
      selectedPageId: data!.editingVersion.data.pages[0].id,
      dirty: false,
    }),
    [data]
  );

  const store = useRef(createEditCraftStore(initialData)).current;

  useEffect(() => {
    // TODO: notify the user that the form has been changed by someone else
    store.getState().reset({
      ...initialData,
      selectedPageId: store.getState().selectedPageId,
    });
  }, [initialData, store]);

  return (
    <EditCraftStoreContext.Provider value={store}>
      {props.children}
    </EditCraftStoreContext.Provider>
  );
}
