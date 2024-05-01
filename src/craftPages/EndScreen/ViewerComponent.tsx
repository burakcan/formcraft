"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewerAsLink } from "../atoms/CtaButton";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { EndScreen } from "./schema";

interface Props {
  page: EndScreen;
}

export function EndScreenViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer>
      <BaseContentViewer page={page} />
      {page.showCta && (
        <div className="w-full pt-2">
          <CtaButtonViewerAsLink page={page} icon={ChevronRight} />
        </div>
      )}
    </PageWrapperViewer>
  );
}
