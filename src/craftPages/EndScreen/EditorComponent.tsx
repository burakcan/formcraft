"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaButtonEditor } from "../pageAtoms/CtaButton";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
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
      {page.showCta && (
        <div className="w-full p-2 pb-0">
          <CtaButtonEditor
            page={page}
            onChange={onChange}
            icon={ChevronRight}
          />
        </div>
      )}
    </PageWrapperEditor>
  );
}
