"use client";

import { BaseContentEditor } from "../atoms/BaseContent";
import { CtaButtonEditor } from "../atoms/CtaButton";
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
      <div className="w-full p-2">
        <CtaButtonEditor page={page} onChange={onChange} />
      </div>
    </PageWrapperEditor>
  );
}
