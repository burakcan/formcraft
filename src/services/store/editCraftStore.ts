import type { Craft, CraftVersion } from "@prisma/client";
import { produce } from "immer";
import { debounce, isEqual, omit } from "lodash";
import type { SetStateAction } from "react";
import { createContext } from "react";
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow";
import {
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  getOutgoers,
  updateEdge,
  type ReactFlowJsonObject,
} from "reactflow";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { create } from "zustand";
import {
  findPageIndexes,
  shiftEndingsToEnd,
  splitContentAndEnding,
} from "@/lib/utils";

export type EditCraftStoreState = {
  craft: Craft;
  editingVersion: CraftVersion;
  selectedPageId: string;
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
  setFlow: (flow: ReactFlowJsonObject) => void;
  setNodes: (nodes: SetStateAction<Node[]>) => void;
  setEdges: (edges: SetStateAction<Edge[]>) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
};

export type EditCraftStore = EditCraftStoreState & EditCraftStoreActions;
export type TemporalEditCraftStore = TemporalState<
  Omit<EditCraftStoreState, "selectedPageId">
>;

const syncFlowOrderWithPages = (
  state: EditCraftStoreState,
  draftState: EditCraftStoreState
) => {
  const stateFlow = state.editingVersion.data.flow;
  const draftFlow = draftState.editingVersion.data.flow;
  const statePages = state.editingVersion.data.pages;
  const draftPages = draftState.editingVersion.data.pages;

  if (stateFlow.nodes.length !== draftPages.length) {
    // The number of pages in the flow and the number of pages in the pages list are different
    // We can't sync the flow with the pages
    return;
  }

  // find the root node of the flow
  const rootNode = stateFlow.nodes.find((n) => {
    const connectedEdges = getConnectedEdges([n], stateFlow.edges);
    return connectedEdges.length === 1 && connectedEdges[0].source === n.id;
  }) as Node;

  let orderMatch = true;

  const walkFlow = (node: Node, step: number) => {
    const matchesPage = statePages[step]?.id === node.data.pageId;

    if (!matchesPage) {
      orderMatch = false;
      return;
    }

    const [nextNode] = getOutgoers(node, stateFlow.nodes, stateFlow.edges);

    if (!nextNode) return;

    walkFlow(nextNode, step + 1);
  };

  walkFlow(rootNode, 0);

  if (!orderMatch) {
    // The order of the pages in the flow does not match the order of the pages in the pages list
    // We can't sync the flow with the pages
    return;
  }

  draftFlow.edges = [];
  draftPages.forEach((page, index) => {
    const nextPage = draftPages[index + 1];
    const node = stateFlow.nodes.find((n) => n.data.pageId === page.id);

    if (!node) return;

    const existingConnections = getConnectedEdges([node], stateFlow.edges);

    if (
      !existingConnections.length ||
      !nextPage ||
      page.type === "end_screen"
    ) {
      return;
    }

    const edge: Edge = {
      id: `edge-${page.id}-${nextPage.id}`,
      source: page.id,
      sourceHandle: "output",
      target: nextPage.id,
      targetHandle: "input",
      type: "removable",
    };

    draftFlow.edges.push(edge);
  });

  draftFlow.nodes.sort((a, b) => {
    const aIndex = draftPages.findIndex((p) => p.id === a.data.pageId);
    const bIndex = draftPages.findIndex((p) => p.id === b.data.pageId);

    return bIndex - aIndex;
  });
};

const syncFlowWithPages = (
  state: EditCraftStoreState,
  draftState: EditCraftStoreState
) => {
  const stateFlow = state.editingVersion.data.flow;
  const draftFlow = draftState.editingVersion.data.flow;
  const draftPages = draftState.editingVersion.data.pages;

  // pages that exist in the draft but not in the state flow
  const newPages = draftPages.filter(
    (p) =>
      !state.editingVersion.data.flow.nodes.some((e) => e.data.pageId === p.id)
  );

  // pages that exist in the state flow but not in the draft
  const removedPageNodes = stateFlow.nodes.filter(
    (e) => e.type === "page" && !draftPages.some((p) => p.id === e.data.pageId)
  );

  newPages.forEach((page) => {
    // find the page that comes before the new page
    const { index } = findPageIndexes(draftPages, page.id);
    const previousPage = draftPages[index - 1];
    const previousPageNode = stateFlow.nodes.find(
      (n) => n.data.pageId === previousPage?.id
    );

    const newNode = {
      id: page.id,
      type: "page",
      position: { x: 0, y: 0 },
      data: { pageId: page.id },
    };

    // find the node that is most right and most bottom

    const maxX = Math.max(...stateFlow.nodes.map((n) => n.position.x), 0);
    const minX = Math.min(...stateFlow.nodes.map((n) => n.position.x), 0);
    const maxY = Math.max(...stateFlow.nodes.map((n) => n.position.y), 0);

    newNode.position =
      page.type === "end_screen"
        ? {
            x: maxX,
            y: maxY + 100,
          }
        : {
            x: minX,
            y: maxY + 70,
          };

    draftFlow.nodes.push(newNode);

    if (previousPageNode) {
      const connectedEdges = getConnectedEdges(
        [previousPageNode],
        stateFlow.edges
      );

      const [prevNodeOutputConnection] = connectedEdges.filter(
        (e) => e.source === previousPageNode.id
      );

      if (!prevNodeOutputConnection) {
        // Probably the previous page is an ending page
        return;
      }

      const targetNode = stateFlow.nodes.find(
        (n) => n.id === prevNodeOutputConnection.target
      );

      if (targetNode?.type === "page" && page.type !== "end_screen") {
        // New page is created between two pages.
        // Connect the previous page to the new page
        // and the new page to the next page

        // Connect the previous page to the new page
        draftFlow.edges = updateEdge(
          prevNodeOutputConnection,
          {
            target: prevNodeOutputConnection.target,
            targetHandle: "input",
            source: page.id,
            sourceHandle: "output",
          },
          draftFlow.edges
        );

        // Connect the new page to the next page
        draftFlow.edges.push({
          id: `${previousPage.id}-${page.id}`,
          source: previousPage.id,
          target: page.id,
          type: "removable",
        });
      } else {
        // TODO: Show a warning to the user
      }
    }
  });

  removedPageNodes.forEach((node) => {
    draftFlow.nodes = draftFlow.nodes.filter((n) => n.id !== node.data.pageId);

    const connectedEdges = getConnectedEdges([node], stateFlow.edges).map(
      (e) => e.id
    );

    draftFlow.edges = draftFlow.edges.filter(
      (e) => !connectedEdges.includes(e.id)
    );
  });
};

export const createEditCraftStore = (initialData: EditCraftStoreState) => {
  return create<EditCraftStore>()(
    temporal(
      (set) => ({
        ...initialData,
        setCraft: (craft: Craft) =>
          set({
            craft,
          }),

        setEditingVersion: (editingVersion: CraftVersion) =>
          set({
            editingVersion,
          }),

        setCraftTitle: (title: string) =>
          set((state) =>
            produce(state, (draft) => {
              draft.craft.title = title;
            })
          ),

        addPage: (page: FormCraft.CraftPage) =>
          set((state) =>
            produce(state, (draft) => {
              const { index: selectedPageIndex } = findPageIndexes(
                state.editingVersion.data.pages,
                state.selectedPageId
              );

              draft.editingVersion.data.pages.splice(
                selectedPageIndex + 1,
                0,
                page
              );

              draft.editingVersion.data.pages = shiftEndingsToEnd(
                draft.editingVersion.data.pages
              );

              syncFlowWithPages(state, draft);
            })
          ),

        removePage: (pageId: string) =>
          set((state) =>
            produce(state, (draft) => {
              const { endingPages, contentPages } = splitContentAndEnding(
                state.editingVersion.data.pages
              );

              const indexInContent = contentPages.findIndex(
                (p) => p.id === pageId
              );
              const indexInEndings = endingPages.findIndex(
                (p) => p.id === pageId
              );

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

              draft.selectedPageId = nextSelectedPageId;
              draft.editingVersion.data.pages =
                draft.editingVersion.data.pages.filter((p) => p.id !== pageId);

              syncFlowWithPages(state, draft);
            })
          ),

        editPage: (pageId: string, page: FormCraft.CraftPage) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.pages =
                state.editingVersion.data.pages.map((p) =>
                  p.id === pageId ? page : p
                );
            })
          ),

        onReorder: (pages: FormCraft.CraftPage[]) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.pages = pages;

              syncFlowOrderWithPages(state, draft);
            })
          ),

        setFlow: (flow: ReactFlowJsonObject) =>
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

        onNodesChange: (changes: NodeChange[]) => {
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

        onEdgesChange: (changes: EdgeChange[]) =>
          set((state) =>
            produce(state, (draft) => {
              draft.editingVersion.data.flow.edges = applyEdgeChanges(
                changes,
                state.editingVersion.data.flow.edges
              );
            })
          ),

        setSelectedPage: (selectedPageId) => set({ selectedPageId }),

        reset: (data: EditCraftStoreState) => set(data),
      }),
      {
        equality: isEqual,
        limit: 50,
        handleSet: (handleSet) =>
          debounce(handleSet, 1000, { leading: true, trailing: false }),
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
