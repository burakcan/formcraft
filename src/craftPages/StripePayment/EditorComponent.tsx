"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import { ShortInputEditor } from "../pageAtoms/ShortInput";
import type { StripePayment } from "./schema";

interface Props {
  page: StripePayment;
  onChange: (pageId: string, page: StripePayment) => void;
}

export function StripePaymentEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <ShortInputEditor />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
