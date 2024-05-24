"use client";

import { CheckIcon } from "lucide-react";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useKeyboardOptionSelection } from "@/hooks/useKeyboardOptionSelection";
import { useBreakpoint } from "@/hooks/useTailwindBreakpoints";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import type { FormValues } from "../pageAtoms/PageWrapper";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type OpinionScale } from "./schema";

interface Props {
  page: OpinionScale;
}

function OpinionScaleOptions(
  props: Props & { form: UseFormReturn<FormValues<OpinionScale>> }
) {
  const { page, form } = props;
  const isDesktop = useBreakpoint("sm");
  const { min, max } = page;
  const items = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => i + min),
    [min, max]
  );

  useKeyboardOptionSelection({
    totalOptions: items.length,
    onSelectOption: (optionIndex) => {
      form.setValue("value", items[optionIndex]);
    },
    optionType: "number",
  });

  return (
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
  );
}

export function OpinionScaleViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <OpinionScaleOptions page={page} form={form} />
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
