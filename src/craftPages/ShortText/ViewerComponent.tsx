"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewer } from "../atoms/CtaButton";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { ShortText } from "./schema";
import { Input } from "@/components/ui/input";

interface Props {
  page: ShortText;
}

export function ShortTextViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer innerWrapperClassName="max-w-screen-md mx-auto">
      <BaseContentViewer page={page} />
      <div className="w-full pt-2">
        <Input
          className="text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="w-full py-2">
        <CtaButtonViewer page={page} icon={CheckIcon} />
        <span className="ml-2 text-sm whitespace-nowrap">
          or press <kbd>Enter</kbd>
        </span>
      </div>
    </PageWrapperViewer>
  );
}
