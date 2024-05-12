import type { Craft, CraftSubmission, CraftVersion } from "@prisma/client";
import { produce } from "immer";
import { createContext } from "react";
import type { Node } from "reactflow";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { create } from "zustand";
import { runFlow } from "@/lib/flowRunners";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export type ViewCraftStoreState = {
  craft: Craft;
  version: CraftVersion;
  submissionId?: CraftSubmission["id"]; // empty when previewing
  themes: Record<string, CraftTheme>;
  rootNodeId: string;
  currentNodeId: string;
  currentPageId: string;
  variables: Record<string, FormCraft.CraftAnswer>;
  answers: Record<
    string,
    {
      meta: {};
      value: FormCraft.CraftAnswer;
    }
  >;
};

export type ViewCraftStoreActions = {
  onAnswer(pageId: string, answer: FormCraft.CraftAnswer, meta?: {}): void;

  getCurrentNode(): Node;
  getCurrentPage(): FormCraft.CraftPage;
};

export type ViewCraftStore = ViewCraftStoreState & ViewCraftStoreActions;

export type TemporalViewCraftStore = TemporalState<
  Pick<ViewCraftStoreState, "currentNodeId" | "currentPageId" | "variables">
>;

export const createViewCraftStore = (initialData: ViewCraftStoreState) => {
  return create<ViewCraftStore>()(
    temporal(
      (set, get) => {
        return {
          ...initialData,

          getCurrentNode: () =>
            get().version.data.flow.nodes.find(
              (node) => node.id === get().currentNodeId
            )!,

          getCurrentPage: () =>
            [...get().version.data.pages, ...get().version.data.end_pages].find(
              (page) => page.id === get().currentPageId
            )!,

          onAnswer: (pageId, answer, meta) => {
            set((state) =>
              produce(state, (draft) => {
                const page = state.version.data.pages.find(
                  (p) => p.id === pageId
                );

                draft.answers[pageId] = {
                  value: answer,
                  meta: meta || {},
                };

                draft.variables[page?.variableName || ""] = answer;

                runFlow(answer, state, draft);
              })
            );
          },
        };
      },
      {
        partialize: (state) => {
          // THIS IS IMPORTANT.
          // Be very careful and understand how everything works before changing this.
          return {
            currentNodeId: state.currentNodeId,
            currentPageId: state.currentPageId,
            variables: state.variables,
          };
        },
      }
    )
  );
};

export const ViewCraftStoreContext = createContext<ReturnType<
  typeof createViewCraftStore
> | null>(null);
