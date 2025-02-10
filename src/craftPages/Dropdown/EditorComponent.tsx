"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { ChoiceOptionsEditor } from "../pageAtoms/ChoiceOptions";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { Dropdown } from "./schema";

interface Props {
  page: Dropdown;
  onChange: (pageId: string, page: Dropdown) => void;
}

export function DropdownEditor({ page, onChange }: Props) {
  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <ChoiceOptionsEditor page={page} onChange={onChange} />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
