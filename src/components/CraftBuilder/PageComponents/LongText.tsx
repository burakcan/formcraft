"use client";

import { CheckIcon } from "lucide-react";
import type { LongText } from "@/lib/craftPageConfig";
import { BaseContent } from "../PageAtoms/BaseContent";
import { CtaButton } from "../PageAtoms/CtaButton";
import { PageWrapper } from "../PageAtoms/PageWrapper";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  page: LongText;
  onChange: (pageId: string, page: LongText) => void;
}

export function LongTextRenderer(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapper>
      <BaseContent page={page} onChange={onChange} />
      <Textarea
        className="mt-4 text-xl h-44 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
        placeholder="Type your answer here..."
      />
      <div className="mt-2 w-full">
        <CtaButton page={page} onChange={onChange} icon={CheckIcon} />
        <span className="ml-2 text-sm whitespace-nowrap">
          or press <kbd>Meta</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapper>
  );
}
