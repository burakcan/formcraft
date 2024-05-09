"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { NumberInput } from "./schema";
import { Input } from "@/components/ui/input";

interface Props {
  page: NumberInput;
  onChange: (pageId: string, page: NumberInput) => void;
}

export function NumberInputEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        <Input
          className="text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
          type="number"
        />
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
