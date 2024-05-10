"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { PhoneNumberFieldViewer } from "../pageAtoms/PhoneNumberField";
import { type PhoneNumber } from "./schema";

interface Props {
  page: PhoneNumber;
}

export function PhoneNumberViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <PhoneNumberFieldViewer form={form} name="value" />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
