"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { ShortInputViewer } from "../pageAtoms/ShortInput";
import { type NumberInput } from "./schema";

interface Props {
  page: NumberInput;
}

export function NumberInputViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <ShortInputViewer
            form={form}
            name="value"
            type="number"
            format={(v) => (v === "" ? "" : parseInt(v, 10))}
          />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
