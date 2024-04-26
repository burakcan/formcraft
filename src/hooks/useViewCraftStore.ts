import { useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { ViewCraftStore } from "@/services/store/viewCraftStore";
import { ViewCraftStoreContext } from "@/services/store/viewCraftStore";

export const useViewCraftStore = <T>(
  selector: (store: ViewCraftStore) => T
): T => {
  const viewCraftStore = useContext(ViewCraftStoreContext);

  if (!viewCraftStore) {
    throw new Error(
      `useViewCraftStore must be use within ViewCraftStoreProvider`
    );
  }

  return useStore(viewCraftStore, useShallow(selector));
};
