"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import { ShortInputEditor } from "../pageAtoms/ShortInput";
import type { Email } from "./schema";

interface Props {
  page: Email;
  onChange: (pageId: string, page: Email) => void;
}

export function EmailEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <ShortInputEditor placeholder="name@example.com" />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
