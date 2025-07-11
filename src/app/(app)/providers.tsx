"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

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

export function Providers(props: PropsWithChildren) {
  const queryClient = getQueryClient();
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>{props.children}</ClerkProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}
