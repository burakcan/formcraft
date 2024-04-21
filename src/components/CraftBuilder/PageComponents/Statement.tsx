"use client";

import type { Statement } from "@/lib/craftPageConfig";
import { BaseContent } from "../PageAtoms/BaseContent";
import { CtaButton } from "../PageAtoms/CtaButton";
import { PageWrapper } from "../PageAtoms/PageWrapper";

interface Props {
  page: Statement;
  onChange: (pageId: string, page: Statement) => void;
}

export function StatementRenderer(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapper>
      <BaseContent page={page} onChange={onChange} />
      <div className="w-full">
        <CtaButton page={page} onChange={onChange} />
      </div>
    </PageWrapper>
  );
}
