"use client";

import { CheckIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useBreakpoint } from "@/hooks/useTailwindBreakpoints";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type OpinionScale } from "./schema";
import useKeyboardOptionSelection from "@/hooks/useKeyboardOptionSelection";

interface Props {
  page: OpinionScale;
}

export function OpinionScaleViewer(props: Props) {
  const isDesktop = useBreakpoint("sm");
  const { page } = props;
  const { min, max } = page;
  const items = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => i + min),
    [min, max]
  );

  useKeyboardOptionSelection({
    totalOptions: items.length,
    onSelectOption: (optionIndex) => {
      // Assuming the form hook is accessible and has a method to set values directly
      form.setValue('value', items[optionIndex]);
    },
    optionType: 'number'
  });

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <div className="w-full pt-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <div
                      className="flex flex-wrap justify-center sm:justify-normal sm:grid gap-2"
                      style={{
                        gridTemplateColumns: isDesktop
                          ? `repeat(${items.length}, minmax(calc(${
                              100 / items.length - 1
                            }% - 0.5rem), auto))`
                          : "",
                      }}
                    >
                      {items.map((item) => (
                        <Button
                          key={item}
                          type="button"
                          variant="choiceOption"
                          size="choiceOption"
                          className={cn(
                            "relative group choiceOptionItem min-h-12 justify-center min-w-12 aspect-square",
                            {
                              "bg-craft-answers/30 hover:bg-craft-answers/30 animate-pulse repeat-[2] duration-500":
                                field.value === item,
                            }
                          )}
                          onClick={() => {
                            field.onChange(item);
                          }}
                        >
                          <div>{item}</div>
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
