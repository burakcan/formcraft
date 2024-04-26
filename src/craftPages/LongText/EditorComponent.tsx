"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../atoms/BaseContent";
import { CtaButtonEditor } from "../atoms/CtaButton";
import { PageWrapperEditor } from "../atoms/PageWrapper";
import type { LongText } from "./schema";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  page: LongText;
  onChange: (pageId: string, page: LongText) => void;
}

export function LongTextEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        <Textarea
          className="text-xl h-44 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="w-full p-2">
        <CtaButtonEditor page={page} onChange={onChange} icon={CheckIcon} />
        <span className="ml-2 text-sm whitespace-nowrap">
          or press <kbd>Meta</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapperEditor>
  );
}
