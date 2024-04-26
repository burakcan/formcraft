"use client";

import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewer } from "../atoms/CtaButton";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { Statement } from "./schema";

interface Props {
  page: Statement;
}

export function StatementViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer>
      <BaseContentViewer page={page} />
      <div className="w-full p-2">
        <CtaButtonViewer page={page} />
      </div>
    </PageWrapperViewer>
  );
}
