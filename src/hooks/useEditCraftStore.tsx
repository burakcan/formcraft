import { useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type {
  EditCraftStore,
  TemporalEditCraftStore,
} from "@/services/store/editCraftStore";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export const useEditCraftStore = <T,>(
  selector: (store: EditCraftStore) => T
): T => {
  const editCraftStoreContext = useContext(EditCraftStoreContext);

  if (!editCraftStoreContext) {
    throw new Error(
      `useEditCraftStore must be use within CounterStoreProvider`
    );
  }

  return useStore(editCraftStoreContext, useShallow(selector));
};

export const useEditCraftStoreTemporal = <T,>(
  selector: (store: TemporalEditCraftStore) => T
): T => {
  const editCraftStoreContext = useContext(EditCraftStoreContext);

  if (!editCraftStoreContext) {
    throw new Error(
      `useEditCraftStore must be use within CounterStoreProvider`
    );
  }

  return useStore(editCraftStoreContext.temporal, selector);
};
