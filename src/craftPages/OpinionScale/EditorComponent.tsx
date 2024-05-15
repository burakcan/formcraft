"use client";

import { CheckIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { OpinionScale } from "./schema";

interface Props {
  page: OpinionScale;
  onChange: (pageId: string, page: OpinionScale) => void;
}

export function OpinionScaleEditor(props: Props) {
  const { page, onChange } = props;
  const { min, max } = page;
  const items = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => i + min),
    [min, max]
  );

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(calc(${
              100 / items.length - 1
            }% - 0.5rem), auto))`,
          }}
        >
          {items.map((item) => (
            <Button
              key={item}
              variant="choiceOption"
              size="choiceOption"
              className="relative group choiceOptionItem h-12 justify-center"
            >
              <div>{item}</div>
            </Button>
          ))}
        </div>
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
