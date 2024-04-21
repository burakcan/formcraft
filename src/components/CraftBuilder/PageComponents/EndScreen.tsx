"use client";

import type { EndScreen } from "@/lib/craftPageConfig";
import { BaseContent } from "../PageAtoms/BaseContent";
import { PageWrapper } from "../PageAtoms/PageWrapper";
import { Button } from "@/components/ui/button";

interface Props {
  page: EndScreen;
  onChange: (pageId: string, page: EndScreen) => void;
}

export function EndScreenRenderer(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapper>
      <BaseContent page={page} onChange={onChange} />
      <div className="w-full">
        {page.cta && <Button className="mt-2">{page.cta}</Button>}
      </div>
    </PageWrapper>
  );
}
