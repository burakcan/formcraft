"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type NumberInput } from "./schema";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  page: NumberInput;
}

export function NumberInputViewer(props: Props) {
  const { page } = props;

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
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      autoFocus
                      className={cn(
                        "text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
                      )}
                      placeholder="Type your answer here..."
                      type="number"
                      onChange={(e) => {
                        if (e.target.value === "") {
                          field.onChange(null);
                          return;
                        }

                        field.onChange(Number(e.target.value));
                      }}
                    />
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
