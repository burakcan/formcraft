"use client";

import { CheckIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { LongText } from "./schema";

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
      <CtaSectionEditor
        page={page}
        onChange={onChange}
        icon={CheckIcon}
        withMeta
      />
    </PageWrapperEditor>
  );
}
