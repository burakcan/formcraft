"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import type { LongText } from "./schema";
import { FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  page: LongText;
}

export function LongTextViewer(props: Props) {
  const { page } = props;
  const autofocus = !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <div className="w-full pt-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    autoFocus={autofocus}
                    value={field.value ?? ""}
                    className="text-xl h-44 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
                    placeholder="Type your answer here..."
                  />
                  {fieldState.error && (
                    <FieldValidationErrorViewer>
                      {fieldState.error.message}
                    </FieldValidationErrorViewer>
                  )}
                </>
              )}
            />
          </div>
          <CtaSectionViewer
            page={page}
            icon={CheckIcon}
            withMeta
            form={formDomId}
          />
        </>
      )}
    </PageWrapperViewer>
  );
}
