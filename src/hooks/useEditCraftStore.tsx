import { useContext } from "react";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function useEditCraftStore() {
  const useStore = useContext(EditCraftStoreContext);

  if (!useStore) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore();

  return store;
}
