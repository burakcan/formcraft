"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import { ShortInputEditor } from "../pageAtoms/ShortInput";
import type { Website } from "./schema";

interface Props {
  page: Website;
  onChange: (pageId: string, page: Website) => void;
}

export function WebsiteEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <ShortInputEditor placeholder="https://example.com" />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
