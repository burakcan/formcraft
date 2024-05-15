"use client";

import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ImageInput } from "@/components/CraftBuilder/PropertiesSidebar/ImageInput";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { InputGroup } from "../InputGroup";

interface Props<T> {
  page: T;
  onChange: (page: T) => void;
}

export function Logo<T extends FormCraft.CraftPage>(props: Props<T>) {
  const { page, onChange } = props;
  const applyLogoToAll = useEditCraftStore((s) => s.applyLogoToAll);

  return (
    <InputGroup>
      <ImageInput
        hideTabs
        noLoading
        objectFit="contain"
        onApplyToAll={() => {
          applyLogoToAll(page.logo);

          toast.success("Logo applied to all pages", {
            description: "This logo will be the default for new pages.",
            icon: <CheckCircle2 />,
          });
        }}
        label="Logo"
        defaultLibraryTab="upload"
        value={page.logo}
        onChange={(value) => {
          onChange({
            ...page,
            logo: value,
          });
        }}
      />
    </InputGroup>
  );
}
