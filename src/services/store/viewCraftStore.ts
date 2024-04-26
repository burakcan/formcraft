import type { Craft, CraftVersion } from "@prisma/client";
import { produce } from "immer";
import { createContext } from "react";
import { create } from "zustand";
import { runFlow } from "@/lib/flowRunners";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export type ViewCraftStoreState = {
  craft: Craft;
  version: CraftVersion;
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
};

export type ViewCraftStore = ViewCraftStoreState & ViewCraftStoreActions;

export const createViewCraftStore = (initialData: ViewCraftStoreState) => {
  return create<ViewCraftStore>((set) => {
    return {
      ...initialData,

      onAnswer: (pageId, answer, meta) => {
        set((state) =>
          produce(state, (draft) => {
            draft.answers[pageId] = {
              value: answer,
              meta: meta || {},
            };

            runFlow(answer, state, draft);
          })
        );
      },
    };
  });
};

export const ViewCraftStoreContext = createContext<ReturnType<
  typeof createViewCraftStore
> | null>(null);
