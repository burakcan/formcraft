"use client";

import type { ChangeEventHandler } from "react";
import { useContext } from "react";
import { useStore } from "zustand";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { EditCraftStoreContext } from "@/services/store/editCraftStore";

export function CraftName() {
  const ctx = useContext(EditCraftStoreContext);

  if (!ctx) {
    throw new Error("EditCraftStoreContext is not provided");
  }

  const store = useStore(ctx);
  const { craft, setCraftTitle } = store;

  const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = (e) =>
    setCraftTitle(e.target.value);

  return (
    <BreadcrumbPage>
      <Input value={craft.title} onChange={handleChangeTitle} />
    </BreadcrumbPage>
  );
}
