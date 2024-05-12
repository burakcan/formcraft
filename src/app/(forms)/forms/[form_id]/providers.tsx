"use client";

import type { Craft, CraftSubmission, CraftVersion } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useRef } from "react";
import type { CraftTheme } from "@/craftPages/schemas/theming";
import { PageChangeReasonProvider } from "@/hooks/usePageChangeReason";
import {
  ViewCraftStoreContext,
  createViewCraftStore,
} from "@/services/store/viewCraftStore";

interface Props {
  craft: Craft;
  version: CraftVersion;
  submissionId: CraftSubmission["id"];
  themes: Record<string, CraftTheme>;
  rootNodeId: string;
  rootPageId: string;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // supsends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: PropsWithChildren<Props>) {
  const { craft, version, submissionId, themes, rootNodeId, rootPageId } =
    props;

  const storeRef = useRef<ReturnType<typeof createViewCraftStore>>();

  const queryClient = getQueryClient();

  if (!storeRef.current) {
    storeRef.current = createViewCraftStore({
      craft,
      version,
      themes,
      submissionId,
      rootNodeId,
      currentNodeId: rootNodeId,
      currentPageId: rootPageId,
      variables: {},
      answers: {},
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PageChangeReasonProvider>
        <ViewCraftStoreContext.Provider value={storeRef.current}>
          {props.children}
        </ViewCraftStoreContext.Provider>
      </PageChangeReasonProvider>
    </QueryClientProvider>
  );
}
