"use client";

import type { ChangeEventHandler } from "react";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function CraftName() {
  const store = useEditCraftStore();
  const { craft, setCraftTitle } = store;

  const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = (e) =>
    setCraftTitle(e.target.value);

  return (
    <BreadcrumbPage>
      <Input value={craft.title} onChange={handleChangeTitle} />
    </BreadcrumbPage>
  );
}
