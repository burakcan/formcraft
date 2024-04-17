"use client";

import type { ChangeEventHandler } from "react";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function CraftName() {
  const { craft, setCraftTitle } = useEditCraftStore((s) => ({
    craft: s.craft,
    setCraftTitle: s.setCraftTitle,
  }));

  const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = (e) =>
    setCraftTitle(e.target.value);

  return (
    <BreadcrumbPage>
      <Input value={craft?.title || ""} onChange={handleChangeTitle} />
    </BreadcrumbPage>
  );
}
