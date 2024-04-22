"use client";

import { CheckIcon } from "lucide-react";
import type { ShortText } from "@/lib/craftPageConfig";
import { BaseContent } from "../PageAtoms/BaseContent";
import { CtaButton } from "../PageAtoms/CtaButton";
import { PageWrapper } from "../PageAtoms/PageWrapper";
import { Input } from "@/components/ui/input";

interface Props {
  page: ShortText;
  onChange: (pageId: string, page: ShortText) => void;
}

export function ShortTextRenderer(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapper>
      <BaseContent page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        <Input
          className="text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="w-full p-2">
        <CtaButton page={page} onChange={onChange} icon={CheckIcon} />
        <span className="ml-2 text-sm">
          or press <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapper>
  );
}
