"use client";

import { CheckIcon } from "lucide-react";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { ChoiceOptionsViewer } from "../pageAtoms/ChoiceOptions/ViewerComponent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import { type Choices } from "./schema";

interface Props {
  page: Choices;
}

export function ChoicesViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <ChoiceOptionsViewer page={page} form={form} />
          {/* <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <>
                <div className="flex flex-col gap-2">
                  {page.options.map((option, index) => (
                    <Button
                      key={index}
                      type="button"
                      className="border"
                      variant={
                        field.value?.includes(option.id)
                          ? "default"
                          : "secondary"
                      }
                      onClick={() => {
                        if (page.multiple === false) {
                          field.onChange([option.id]);
                          return;
                        }

                        if (field.value?.includes(option.id)) {
                          field.onChange(
                            field.value.filter((id) => id !== option.id)
                          );
                        } else {
                          field.onChange([...(field.value || []), option.id]);
                        }
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {fieldState.error && (
                  <FieldValidationErrorViewer>
                    {fieldState.error.message}
                  </FieldValidationErrorViewer>
                )}
              </>
            )}
          /> */}
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
