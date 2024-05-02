"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaSectionViewer } from "../atoms/CtaSection";
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
      <CtaSectionViewer page={page} icon={CheckIcon} withMeta />
    </PageWrapperViewer>
  );
}
