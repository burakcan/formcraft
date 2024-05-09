"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { Statement } from "./schema";

interface Props {
  page: Statement;
  onChange: (pageId: string, page: Statement) => void;
}

export function StatementEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <CtaSectionEditor page={page} onChange={onChange} icon={ChevronRight} />
    </PageWrapperEditor>
  );
}
