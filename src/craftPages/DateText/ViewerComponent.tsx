"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { DateInputViewer } from "../pageAtoms/DateInput";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type DateText } from "./schema";

interface Props {
  page: DateText;
}

export function DateTextViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <DateInputViewer
            form={form}
            name="value"
            dateFormat={page.dateFormat}
            separator={page.separator}
          />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
