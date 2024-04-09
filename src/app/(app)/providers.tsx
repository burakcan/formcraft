"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";

export function Providers(props: PropsWithChildren) {
  return <ClerkProvider>{props.children}</ClerkProvider>;
}
