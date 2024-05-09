"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaButtonViewerAsLink } from "../pageAtoms/CtaButton";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import type { EndScreen } from "./schema";

interface Props {
  page: EndScreen;
}

export function EndScreenViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {() => (
        <>
          <BaseContentViewer page={page} />
          {page.showCta && (
            <div className="w-full pt-2">
              <CtaButtonViewerAsLink page={page} icon={ChevronRight} />
            </div>
          )}
        </>
      )}
    </PageWrapperViewer>
  );
}
