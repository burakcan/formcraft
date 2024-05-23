"use client";

import {
  CheckIcon,
  HeartIcon,
  SmileIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type StarRating } from "./schema";
import { useKeyboardOptionSelection } from "@/hooks/useKeyboardOptionSelection";

interface Props {
  page: StarRating;
}

const Icons = {
  star: StarIcon,
  heart: HeartIcon,
  thumb: ThumbsUpIcon,
  smiley: SmileIcon,
};

export function StarRatingViewer(props: Props) {
  const { page } = props;
  const { numStars } = page;
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const items = useMemo(
    () => Array.from({ length: numStars }, (_, i) => i + 1).reverse(),
    [numStars]
  );

  const Icon = Icons[page.ratingIcon];

  useKeyboardOptionSelection({
    totalOptions: numStars,
    onSelectOption: (optionIndex) => {
      // Assuming the form hook is accessible and has a method to set values directly
      form.setValue('value', optionIndex + 1);
    },
    optionType: 'star'
  });

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <div className="w-full py-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <div
                      className="flex gap-2 justify-start flex-wrap"
                      onMouseLeave={() => setHoveredStar(null)}
                    >
                      {items.map((item) => (
                        <Button
                          key={item}
                          variant="ghost"
                          type="button"
                          size="choiceOption"
                          className="relative flex-col group choiceOptionItem h-auto w-14 justify-center hover:bg-transparent"
                          style={{
                            order: item,
                          }}
                          onMouseOver={() => setHoveredStar(item)}
                          onClick={() => field.onChange(item)}
                        >
                          <div className="">
                            <Icon
                              className={cn(
                                "star size-10 stroke-craft-answers stroke-1",
                                {
                                  "fill-craft-answers/20":
                                    item <= Number(hoveredStar) ||
                                    item <= field.value,
                                  "fill-craft-answers/50 animate-pulse repeat-[2] duration-500":
                                    item === field.value,
                                }
                              )}
                            />
                          </div>
                          <div className="text-craft-answers font-normal text-sm">
                            {item}
                          </div>
                        </Button>
                      ))}
                    </div>
                    {fieldState.error && (
                      <FieldValidationErrorViewer>
                        {fieldState.error.message}
                      </FieldValidationErrorViewer>
                    )}
                  </>
                );
              }}
            />
          </div>
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
