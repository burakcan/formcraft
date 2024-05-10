"use client";

import "react-phone-number-input/style.css";
import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import { PhoneNumberFieldEditor } from "../pageAtoms/PhoneNumberField";
import type { PhoneNumber } from "./schema";

interface Props {
  page: PhoneNumber;
  onChange: (pageId: string, page: PhoneNumber) => void;
}

export function PhoneNumberEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <PhoneNumberFieldEditor />
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
