"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { ShortInputViewer } from "../pageAtoms/ShortInput";
import { type Email } from "./schema";

interface Props {
  page: Email;
}

export function EmailViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <ShortInputViewer
            form={form}
            name="value"
            type="email"
            placeholder="name@example.com"
          />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
