import { useContext } from "react";
import type { TemporalState } from "zundo";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { EditCraftStore } from "@/services/store/editCraftStore";
import {
  EditCraftStoreContext,
  createEditCraftStore,
} from "@/services/store/editCraftStore";

export function useUseEditCraftStore(initialData?: any) {
  const useStore = useContext(EditCraftStoreContext);

  if (!useStore) {
    return createEditCraftStore(initialData);
  }

  return useStore;
}

export const useEditCraftStore = <T,>(
  selector: (store: EditCraftStore) => T
): T => {
  const counterStoreContext = useContext(EditCraftStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, useShallow(selector));
};

export const useEditCraftStoreTemporal = <T,>(
  selector: (store: TemporalState<EditCraftStore>) => T
): T => {
  const counterStoreContext = useContext(EditCraftStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext.temporal, useShallow(selector));
};
