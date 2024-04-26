"use client";

import { BaseContentEditor } from "../atoms/BaseContent";
import { CtaButtonEditor } from "../atoms/CtaButton";
import { PageWrapperEditor } from "../atoms/PageWrapper";
import type { EndScreen } from "./schema";

interface Props {
  page: EndScreen;
  onChange: (pageId: string, page: EndScreen) => void;
}

export function EndScreenEditor(props: Props) {
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
