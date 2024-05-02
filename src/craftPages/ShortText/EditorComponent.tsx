"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../atoms/BaseContent";
import { CtaSectionEditor } from "../atoms/CtaSection";
import { PageWrapperEditor } from "../atoms/PageWrapper";
import type { ShortText } from "./schema";
import { Input } from "@/components/ui/input";

interface Props {
  page: ShortText;
  onChange: (pageId: string, page: ShortText) => void;
}

export function ShortTextEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        <Input
          className="text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
