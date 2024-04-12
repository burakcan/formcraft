"use client";
import type { Craft, CraftVersion } from "@prisma/client";
import type { PropsWithChildren } from "react";
import { useRef } from "react";
import {
  EditCraftStoreContext,
  createEditCraftStore,
} from "@/services/store/editCraftStore";

interface Props {
  craft: Craft;
  editingVersion: CraftVersion;
}

export function Providers(props: PropsWithChildren<Props>) {
  const { craft, editingVersion } = props;

  const store = useRef(
    createEditCraftStore({
      craft,
      editingVersion,
      selectedPageId: editingVersion.data.pages[0].id,
    })
  ).current;

  return (
    <EditCraftStoreContext.Provider value={store}>
      {props.children}
    </EditCraftStoreContext.Provider>
  );
}
