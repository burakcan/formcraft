import type { CraftVersion } from "@prisma/client";
import { produce } from "immer";
import { debounce, isEqual, omit } from "lodash";
import type { SetStateAction } from "react";
import { createContext } from "react";
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getIncomers,
  getConnectedEdges,
  // getOutgoers,
  updateEdge,
  type ReactFlowJsonObject,
  getOutgoers,
} from "reactflow";
import { v4 as uuid } from "uuid";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { create } from "zustand";
import type { ThemeImageType } from "@/craftPages/schemas/theming";

export type EditCraftStoreState = {
  craft: FormCraft.Craft;
  editingVersion: CraftVersion;
  selectedPageId: string;
};

export type EditCraftStoreActions = {
  setCraft: (craft: FormCraft.Craft) => void;
  setCraftTitle: (title: string) => void;
  addPage: (page: FormCraft.CraftPage, ending?: boolean) => void;
  removePage: (pageId: string, ending?: boolean) => void;
  setEditingVersion: (editingVersion: CraftVersion) => void;
  setSelectedPage: (pageId: string) => void;
  editPage: <T extends FormCraft.CraftPage>(pageId: string, page: T) => void;
  reset: (data: EditCraftStoreState) => void;
  onReorderPages: (pages: FormCraft.CraftPage[], endings?: boolean) => void;
  setFlow: (flow: ReactFlowJsonObject) => void;
  setNodes: (nodes: SetStateAction<Node[]>) => void;
  setEdges: (edges: SetStateAction<Edge[]>) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  applyThemeToAll: (themeId: string) => void;
  applyLogoToAll: (logo: ThemeImageType | undefined) => void;
  getSelectedPage: () =>
    | FormCraft.CraftPage
    | FormCraft.CraftEndPage
    | undefined;
};

export type EditCraftStore = EditCraftStoreState & EditCraftStoreActions;
export type TemporalEditCraftStore = TemporalState<
  Omit<
    EditCraftStoreState,
    "selectedPageId" | "defaultThemeForNewPages" | "defaultLogoForNewPages"
  >
>;

export const createEditCraftStore = (initialData: EditCraftStoreState) => {
  return create<EditCraftStore>()(
    temporal(
      (set, get) => ({
        ...initialData,

        getSelectedPage: () =>
          get().editingVersion.data.pages.find(
            (p) => p.id === get().selectedPageId
          ) ||
          get().editingVersion.data.end_pages.find(
            (p) => p.id === get().selectedPageId
          ),

        applyThemeToAll: (themeId) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.defaultTheme = themeId;

              [
                ...draft.editingVersion.data.pages,
                ...draft.editingVersion.data.end_pages,
              ].forEach((page) => {
                page.baseThemeId = themeId;
                page.themeOverride = {};
              });
            })
          ),

        applyLogoToAll: (logo) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.defaultLogo = logo;

              [
                ...draft.editingVersion.data.pages,
                ...draft.editingVersion.data.end_pages,
              ].forEach((page) => {
                page.logo = logo;
              });
            })
          ),

        setCraft: (craft) =>
          set({
            craft,
          }),

        setEditingVersion: (editingVersion) =>
          set({
            editingVersion,
          }),

        setCraftTitle: (title) =>
          set((state) =>
            produce(state, (draft) => {
              draft.craft.title = title;
            })
          ),

        addPage: (page, ending) =>
          set((state) =>
            produce(state, (draft) => {
              const statePages = ending
                ? state.editingVersion.data.end_pages
                : state.editingVersion.data.pages;

              const draftPages = ending
                ? draft.editingVersion.data.end_pages
                : draft.editingVersion.data.pages;

              const selectedPageIndex = statePages.findIndex(
                (p) => p.id === state.selectedPageId
              );

              let insertIndex =
                selectedPageIndex === -1
                  ? statePages.length
                  : selectedPageIndex + 1;

              draftPages.splice(insertIndex, 0, page);

              // create and add the new node
              const newNode: Node = {
                id: page.id,
                type: ending ? "endPage" : "page",
                position: { x: 0, y: 0 },
                data: { pageId: page.id },
              };

              draft.editingVersion.data.flow.nodes.push(newNode);

              // Find a logical place to connect the new node
              let nextPageId: string;

              if (ending) {
                nextPageId = draftPages[insertIndex + 1]?.id;
              } else {
                nextPageId =
                  draftPages[insertIndex + 1]?.id ||
                  draft.editingVersion.data.end_pages[0]?.id;
              }

              const nextPageNode = state.editingVersion.data.flow.nodes.find(
                (n) => n.data.pageId === nextPageId
              );

              if (!nextPageNode || page.type === "end_screen") {
                // probably added as a last ending page
                return;
              }

              const [firstIncomer] = getIncomers(
                nextPageNode,
                state.editingVersion.data.flow.nodes,
                state.editingVersion.data.flow.edges
              );

              const [existingConnection] = getConnectedEdges(
                [nextPageNode, firstIncomer],
                state.editingVersion.data.flow.edges
              ).filter((e) => e.target === nextPageNode.id);

              draft.editingVersion.data.flow.edges = addEdge(
                {
                  id: uuid(),
                  target: newNode.id,
                  targetHandle: "input",
                  source: existingConnection.source,
                  sourceHandle: existingConnection.sourceHandle,
                  type: "removable",
                },
                updateEdge(
                  existingConnection,
                  {
                    source: newNode.id,
                    sourceHandle: "output",
                    target: nextPageNode.id,
                    targetHandle: "input",
                  },
                  state.editingVersion.data.flow.edges
                )
              );
            })
          ),

        removePage: (pageId, ending) =>
          set((state) =>
            produce(state, (draft) => {
              const statePages = ending
                ? state.editingVersion.data.end_pages
                : state.editingVersion.data.pages;

              const draftPages = ending
                ? draft.editingVersion.data.end_pages
                : draft.editingVersion.data.pages;

              const pageIndex = statePages.findIndex((p) => p.id === pageId);

              if (pageIndex > -1 && statePages.length === 1) {
                return state;
              }

              let nextSelectedPageId = state.selectedPageId;

              if (state.selectedPageId === pageId && statePages.length > 1) {
                nextSelectedPageId =
                  statePages[pageIndex + 1]?.id ||
                  statePages[pageIndex - 1]?.id;
              }

              if (!nextSelectedPageId) {
                return state;
              }

              draft.selectedPageId = nextSelectedPageId;

              if (ending) {
                draft.editingVersion.data.end_pages = draftPages.filter(
                  (p) => p.id !== pageId
                ) as FormCraft.CraftEndPage[];
              } else {
                draft.editingVersion.data.pages =
                  draft.editingVersion.data.pages.filter(
                    (p) => p.id !== pageId
                  );
              }

              const pageNode = state.editingVersion.data.flow.nodes.find(
                (n) => n.data.pageId === pageId
              );

              if (!pageNode) {
                return;
              }

              draft.editingVersion.data.flow.nodes =
                draft.editingVersion.data.flow.nodes.filter(
                  (n) => n.id !== pageId
                );

              const outGoers = getOutgoers(
                pageNode,
                state.editingVersion.data.flow.nodes,
                state.editingVersion.data.flow.edges
              );

              draft.editingVersion.data.flow.edges =
                draft.editingVersion.data.flow.edges.map((e) => {
                  if (e.target === pageNode.id && outGoers[0]) {
                    return {
                      ...e,
                      target: outGoers[0].id,
                      targetHandle: "input",
                    };
                  }

                  return e;
                });
            })
          ),

        editPage: (pageId, page) =>
          set((state) =>
            produce(state, (draft) => {
              const isEnding = page.type === "end_screen";

              if (isEnding) {
                draft.editingVersion.data.end_pages =
                  state.editingVersion.data.end_pages.map((p) =>
                    p.id === pageId ? page : p
                  ) as FormCraft.CraftEndPage[];

                return;
              }

              draft.editingVersion.data.pages =
                state.editingVersion.data.pages.map((p) =>
                  p.id === pageId ? page : p
                );
            })
          ),

        onReorderPages: (pages, endings) =>
          set((state) =>
            produce(state, (draft) => {
              if (endings) {
                draft.editingVersion.data.end_pages =
                  pages as FormCraft.CraftEndPage[];
                return;
              }

              draft.editingVersion.data.pages = pages;
            })
          ),

        setFlow: (flow) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.flow = flow;
            })
          ),

        setNodes: (nodes) => {
          set((state) => {
            const nds =
              typeof nodes === "function"
                ? nodes(state.editingVersion.data.flow.nodes)
                : nodes;

            return produce(state, (draft) => {
              draft.editingVersion.data.flow.nodes = nds;
            });
          });
        },

        setEdges: (edges) => {
          set((state) => {
            const eds =
              typeof edges === "function"
                ? edges(state.editingVersion.data.flow.edges)
                : edges;

            return produce(state, (draft) => {
              draft.editingVersion.data.flow.edges = eds;
            });
          });
        },

        onNodesChange: (changes) => {
          set((state) =>
            produce(state, (draft) => {
              if (changes.every((c) => c.type === "dimensions")) {
                return;
              }

              draft.editingVersion.data.flow.nodes = applyNodeChanges(
                changes,
                state.editingVersion.data.flow.nodes
              );
            })
          );
        },

        onEdgesChange: (changes) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.flow.edges = applyEdgeChanges(
                changes,
                state.editingVersion.data.flow.edges
              );
            })
          ),

        setSelectedPage: (selectedPageId) => set({ selectedPageId }),

        reset: set,
      }),
      {
        equality: isEqual,
        limit: 50,
        handleSet: (handleSet) =>
          debounce(handleSet, 500, { leading: true, trailing: false }),
        partialize: (state) => {
          return omit(state, ["selectedPageId"]);
        },
      }
    )
  );
};

export const EditCraftStoreContext = createContext<ReturnType<
  typeof createEditCraftStore
> | null>(null);
