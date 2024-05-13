"use client";

import {
  CheckIcon,
  HeartIcon,
  SmileIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { StarRating } from "./schema";
import { Button } from "@/components/ui/button";

interface Props {
  page: StarRating;
  onChange: (pageId: string, page: StarRating) => void;
}

const Icons = {
  star: StarIcon,
  heart: HeartIcon,
  thumb: ThumbsUpIcon,
  smiley: SmileIcon,
};

export function StarRatingEditor(props: Props) {
  const { page, onChange } = props;
  const { numStars } = page;
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const items = useMemo(
    () => Array.from({ length: numStars }, (_, i) => i + 1).reverse(),
    [numStars]
  );

  const Icon = Icons[page.ratingIcon];

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 py-2">
        <div
          className="flex gap-2 justify-start"
          onMouseLeave={() => setHoveredStar(null)}
        >
          {items.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="choiceOption"
              className="relative flex-col group choiceOptionItem h-auto w-10 justify-center hover:bg-transparent"
              style={{
                order: item,
              }}
              onMouseOver={() => setHoveredStar(item)}
            >
              <div className="">
                <Icon
                  className={cn("star size-8 stroke-craft-answers stroke-1", {
                    "fill-craft-answers/30": item <= Number(hoveredStar),
                  })}
                />
              </div>
              <div className="text-craft-answers font-normal text-sm">
                {item}
              </div>
            </Button>
          ))}
        </div>
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
