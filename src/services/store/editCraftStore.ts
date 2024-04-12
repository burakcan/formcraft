import type { Craft, CraftVersion } from "@prisma/client";
import { createContext } from "react";
import { create } from "zustand";

type EditCraftStoreState = {
  craft: Craft;
  editingVersion: CraftVersion;
  selectedPageId: string;
};

type EditCraftStoreActions = {
  setCraft: (craft: Craft) => void;
  setCraftTitle: (title: string) => void;
  addPage: (page: FormCraft.CraftPage) => void;
  setEditingVersion: (editingVersion: CraftVersion) => void;
  setSelectedPage: (pageId: string) => void;
  editPage: (pageId: string, page: FormCraft.CraftPage) => void;
};

export const createEditCraftStore = (initialData: EditCraftStoreState) =>
  create<EditCraftStoreState & EditCraftStoreActions>((set) => ({
    ...initialData,
    setCraft: (craft: Craft) => set({ craft }),

    setCraftTitle: (title: string) =>
      set((state) => ({ craft: { ...state.craft, title } })),

    addPage: (page: FormCraft.CraftPage) => {
      set((state) => {
        return {
          ...state,
          editingVersion: {
            ...state.editingVersion,
            data: {
              pages: [...state.editingVersion.data.pages, page],
            },
          },
        };
      });
    },

    editPage: (pageId: string, page: FormCraft.CraftPage) => {
      set((state) => {
        const pages = state.editingVersion.data.pages.map((p) =>
          p.id === pageId ? page : p
        );

        return {
          ...state,
          editingVersion: {
            ...state.editingVersion,
            data: {
              pages,
            },
          },
        };
      });
    },

    setEditingVersion: (editingVersion: CraftVersion) =>
      set({ editingVersion }),

    setSelectedPage: (selectedPageId) => set({ selectedPageId }),
  }));

export const EditCraftStoreContext = createContext<ReturnType<
  typeof createEditCraftStore
> | null>(null);
