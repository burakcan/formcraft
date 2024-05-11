"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { ChoiceOptionsViewer } from "../pageAtoms/ChoiceOptions/ViewerComponent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type Choices } from "./schema";

interface Props {
  page: Choices;
}

export function ChoicesViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <ChoiceOptionsViewer page={page} form={form} />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
