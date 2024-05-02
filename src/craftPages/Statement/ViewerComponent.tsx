"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaSectionViewer } from "../atoms/CtaSection";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { Statement } from "./schema";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

interface Props {
  page: Statement;
}

export function StatementViewer(props: Props) {
  const { page } = props;
  const onAnswer = useViewCraftStore((s) => s.onAnswer);

  return (
    <PageWrapperViewer>
      <BaseContentViewer page={page} />
      <CtaSectionViewer
        page={page}
        onClick={() => onAnswer(page.id, true)}
        icon={ChevronRight}
      />
    </PageWrapperViewer>
  );
}
