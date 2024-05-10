"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { DateInputEditor } from "../pageAtoms/DateInput";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { DateText } from "./schema";
import { usePlaceholder } from "./utils";

interface Props {
  page: DateText;
  onChange: (pageId: string, page: DateText) => void;
}

export function DateTextEditor(props: Props) {
  const { page, onChange } = props;

  const placeHolder = usePlaceholder(page.dateFormat, page.separator);

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <DateInputEditor placeholder={placeHolder} />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
