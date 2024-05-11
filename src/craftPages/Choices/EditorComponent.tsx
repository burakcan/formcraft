"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { ChoiceOptionsEditor } from "../pageAtoms/ChoiceOptions";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { Choices } from "./schema";

interface Props {
  page: Choices;
  onChange: (pageId: string, page: Choices) => void;
}

export function ChoicesEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <ChoiceOptionsEditor page={page} onChange={onChange} />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
