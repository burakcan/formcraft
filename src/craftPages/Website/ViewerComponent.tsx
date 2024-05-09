"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { ShortInputViewer } from "../pageAtoms/ShortInput";
import { type Website } from "./schema";

interface Props {
  page: Website;
}

export function WebsiteViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <ShortInputViewer
            form={form}
            name="value"
            placeholder="https://example.com"
          />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
