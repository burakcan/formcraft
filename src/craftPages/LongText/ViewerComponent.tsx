"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewer } from "../atoms/CtaButton";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { LongText } from "./schema";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  page: LongText;
}

export function LongTextViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer>
      <BaseContentViewer page={page} />
      <div className="w-full pt-2">
        <Textarea
          className="text-xl h-44 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="w-full py-2">
        <CtaButtonViewer page={page} icon={CheckIcon} />
        <span className="ml-2 text-sm whitespace-nowrap">
          or press <kbd>Meta</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapperViewer>
  );
}
