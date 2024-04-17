import { useContext } from "react";
import { useStore } from "zustand";
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

// export const useEditCraftStore = <T,>(
//   selector: (store: EditCraftStore) => T = (s) => s as unknown as T
// ): T => {
//   const counterStoreContext = useContext(EditCraftStoreContext);

//   if (!counterStoreContext) {
//     throw new Error(`useCounterStore must be use within CounterStoreProvider`);
//   }

//   return useStore(counterStoreContext, selector);
// };
