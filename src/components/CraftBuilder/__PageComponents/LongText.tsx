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
      <div className="w-full px-2 pt-2">
        <Textarea
          className="text-xl h-44 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="w-full p-2">
        <CtaButton page={page} onChange={onChange} icon={CheckIcon} />
        <span className="ml-2 text-sm whitespace-nowrap">
          or press <kbd>Meta</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapper>
  );
}
