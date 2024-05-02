"use client";

import type { Craft, CraftSubmission, CraftVersion } from "@prisma/client";
import type { PropsWithChildren } from "react";
import { useRef } from "react";
import type { CraftTheme } from "@/craftPages/schemas/theming";
import {
  ViewCraftStoreContext,
  createViewCraftStore,
} from "@/services/store/viewCraftStore";

interface Props {
  craft: Craft;
  version: CraftVersion;
  submission: CraftSubmission;
  themes: Record<string, CraftTheme>;
  rootNodeId: string;
  rootPageId: string;
}

export function Providers(props: PropsWithChildren<Props>) {
  const { craft, version, submission, themes, rootNodeId, rootPageId } = props;

  const storeRef = useRef<ReturnType<typeof createViewCraftStore>>();

  if (!storeRef.current) {
    storeRef.current = createViewCraftStore({
      craft,
      version,
      themes,
      submission: submission,
      rootNodeId,
      currentNodeId: rootNodeId,
      currentPageId: rootPageId,
      variables: {},
      answers: {},
      lastPageChangeReason: "init",
    });
  }

  return (
    <ViewCraftStoreContext.Provider value={storeRef.current}>
      {props.children}
    </ViewCraftStoreContext.Provider>
  );
}
