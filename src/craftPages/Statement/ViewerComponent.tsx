"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewer } from "../atoms/CtaButton";
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
      <div className="w-full pt-2">
        <CtaButtonViewer
          page={page}
          onClick={() => onAnswer(page.id, true)}
          icon={ChevronRight}
        />
      </div>
    </PageWrapperViewer>
  );
}
