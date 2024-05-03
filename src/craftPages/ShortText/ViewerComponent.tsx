"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaSectionViewer } from "../atoms/CtaSection";
import { FieldValidationErrorViewer } from "../atoms/FieldValidationError";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import { type ShortText } from "./schema";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  page: ShortText;
}

export function ShortTextViewer(props: Props) {
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
