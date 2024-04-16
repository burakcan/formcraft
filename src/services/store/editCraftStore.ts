import type { Craft, CraftVersion } from "@prisma/client";
import { createContext } from "react";
import { create } from "zustand";

export type EditCraftStoreState = {
  craft: Craft;
  editingVersion: CraftVersion;
  selectedPageId: string;
  dirty: boolean;
};

export type EditCraftStoreActions = {
  setCraft: (craft: Craft) => void;
  setCraftTitle: (title: string) => void;
  addPage: (page: FormCraft.CraftPage) => void;
  removePage: (pageId: string) => void;
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

    removePage: (pageId: string) => {
      set((state) => {
        if (!state.editingVersion) {
          return state;
        }

        const [endingPages, contentPages] =
          state.editingVersion.data.pages.reduce(
            (acc, page) => {
              if (page.type === "end_screen") {
                acc[0].push(page);
              } else {
                acc[1].push(page);
              }
              return acc;
            },
            [[], []] as [FormCraft.CraftPage[], FormCraft.CraftPage[]]
          );

        const indexInContent = contentPages.findIndex((p) => p.id === pageId);
        const indexInEndings = endingPages.findIndex((p) => p.id === pageId);

        if (
          (indexInContent > -1 && contentPages.length === 1) ||
          (indexInEndings > -1 && endingPages.length === 1)
        ) {
          // Block removing the last page
          return state;
        }

        let nextSelectedPageId = state.selectedPageId;

        if (state.selectedPageId === pageId) {
          if (indexInContent > -1) {
            nextSelectedPageId =
              contentPages[indexInContent + 1]?.id ||
              contentPages[indexInContent - 1]?.id;
          } else if (indexInEndings > -1) {
            nextSelectedPageId =
              endingPages[indexInEndings + 1]?.id ||
              endingPages[indexInEndings - 1]?.id;
          }
        }

        if (!nextSelectedPageId) {
          return state;
        }

        return {
          ...state,
          dirty: true,
          selectedPageId: nextSelectedPageId,
          editingVersion: {
            ...state.editingVersion,
            data: {
              pages: state.editingVersion.data.pages.filter(
                (p) => p.id !== pageId
              ),
            },
          },
        };
      });
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
