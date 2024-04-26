"use client";

import type { Statement } from "@/lib/craftPageConfig";
import { BaseContent } from "../PageAtoms/BaseContent";
import { CtaButton } from "../PageAtoms/CtaButton";
import { PageWrapper } from "@/components/CraftBuilder/PageAtoms/PageWrapper";

interface Props {
  page: Statement;
}

export function StatementViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapper>
      <BaseContent page={page} />
      <div className="w-full p-2">
        <CtaButton page={page} />
      </div>
    </PageWrapper>
  );
}
