"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentEditor } from "../atoms/BaseContent";
import { CtaSectionEditor } from "../atoms/CtaSection";
import { PageWrapperEditor } from "../atoms/PageWrapper";
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
