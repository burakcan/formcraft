import type { Craft, CraftVersion } from "@prisma/client";
import { createContext } from "react";
import { create } from "zustand";

type EditCraftStoreState = {
  craft: Craft;
  editingVersion: CraftVersion;
  selectedPageId: string;
  dirty: boolean;
};

type EditCraftStoreActions = {
  setCraft: (craft: Craft) => void;
  setCraftTitle: (title: string) => void;
  addPage: (page: FormCraft.CraftPage) => void;
  setEditingVersion: (editingVersion: CraftVersion) => void;
  setSelectedPage: (pageId: string) => void;
  editPage: (pageId: string, page: FormCraft.CraftPage) => void;
  reset: (data: EditCraftStoreState) => void;
  onReorder: (pages: FormCraft.CraftPage[]) => void;
};

export const createEditCraftStore = (initialData: EditCraftStoreState) => {
  return create<EditCraftStoreState & EditCraftStoreActions>((set) => ({
    ...initialData,
    setCraft: (craft: Craft) =>
      set({
        craft,
        dirty: true,
      }),

    setEditingVersion: (editingVersion: CraftVersion) =>
      set({
        editingVersion,
        dirty: true,
      }),

    setCraftTitle: (title: string) =>
      set((state) =>
        state.craft
          ? {
              craft: { ...state.craft, title },
              dirty: true,
            }
          : state
      ),

    addPage: (page: FormCraft.CraftPage) => {
      set((state) =>
        state.editingVersion
          ? {
              ...state,
              dirty: true,
              editingVersion: {
                ...state.editingVersion,
                data: {
                  pages: [...state.editingVersion.data.pages, page],
                },
              },
            }
          : state
      );
    },

    editPage: (pageId: string, page: FormCraft.CraftPage) => {
      set((state) => {
        if (!state.editingVersion) {
          return state;
        }

        const pages = state.editingVersion.data.pages.map((p) =>
          p.id === pageId ? page : p
        );

        return {
          ...state,
          dirty: true,
          editingVersion: {
            ...state.editingVersion,
            data: {
              pages,
            },
          },
        };
      });
    },

    onReorder: (pages: FormCraft.CraftPage[]) => {
      set((state) => {
        if (!state.editingVersion) {
          return state;
        }

        return {
          ...state,
          dirty: true,
          editingVersion: {
            ...state.editingVersion,
            data: {
              pages,
            },
          },
        };
      });
    },

    setSelectedPage: (selectedPageId) => set({ selectedPageId }),

    reset: (data: EditCraftStoreState) => set(data),
  }));
};

export const EditCraftStoreContext = createContext<ReturnType<
  typeof createEditCraftStore
> | null>(null);
