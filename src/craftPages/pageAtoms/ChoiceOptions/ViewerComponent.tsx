import { useEffect } from "react";
import { ImageIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { ThemeImage } from "@/components/CraftBuilder/PageRenderer/ThemeImage";
import type { PageWithOptions } from "@/hooks/useChoiceOptionEditor";
import { cn } from "@/lib/utils";
import { FieldValidationErrorViewer } from "../FieldValidationError";
import { ChoiceLetter } from "./ChoiceLetter";
import useKeyboardOptionSelection from "@/hooks/useKeyboardOptionSelection";
import type { ThemeImageType } from "@/craftPages/schemas/theming";

type ValueType = string[];

interface Props<T extends PageWithOptions> {
  page: T;
  form: UseFormReturn<{
    value: ValueType;
  }>;
}

interface ItemProps<T> {
  option: {
    label: string;
    id: string;
    image: ThemeImageType | null;
  };
  page: T;
  index: number;
  active?: boolean;
  onClick?: () => void;
}

function ChoiceOptionItem<
  T extends PageWithOptions & {
    imageChoices: boolean;
  }
>(props: ItemProps<T>) {
  const { option, index, active, onClick, page } = props;

  return (
    <Button
      type="button"
      variant="choiceOption"
      onClick={onClick}
      className={cn(
        "h-auto min-h-10 pl-0 pr-2 gap-2 whitespace-normal transition-colors",
        {
          "bg-craft-answers/30 hover:bg-craft-answers/30 animate-pulse repeat-[2] duration-500":
            active,
          "items-start pt-2": page.imageChoices,
        }
      )}
    >
      <ChoiceLetter index={index} active={active} />
      <div className="flex-auto flex flex-col">
        {page.imageChoices && (
          <div
            className={cn(
              "choiceOptionImage relative flex-auto h-36 mb-1 overflow-hidden rounded",
              {
                "bg-craft-answers/20 border border-craft-answers/30 flex items-center justify-center":
                  !option.image,
              }
            )}
          >
            {option.image && (
              <div className="blur-md size-full">
                <ThemeImage
                  imageObject={option.image}
                  objectFit="cover"
                  noAttribution
                  noLoading
                />
              </div>
            )}

            {!option.image ? (
              <ImageIcon className="size-8 text-craft-answers/50" />
            ) : (
              <ThemeImage
                imageObject={option.image}
                objectFit="contain"
                noAttribution
                noLoading
              />
            )}
          </div>
        )}
        <span className="max-w-full flex-auto break-all brightness-75">
          {option.label}
        </span>
      </div>
    </Button>
  );
}

export function ChoiceOptionsViewer<
  T extends PageWithOptions & {
    orientation: "vertical" | "horizontal";
    multiple: boolean;
    imageChoices: boolean;
  }
>(props: Props<T>) {
  const { page, form } = props;
  const { options, orientation } = page;

  const handleSelectOption = (index) => {
    const optionId = options[index].id;
    if (page.multiple) {
      if (form.getValues("value").includes(optionId)) {
        form.setValue("value", form.getValues("value").filter(id => id !== optionId));
      } else {
        form.setValue("value", [...form.getValues("value"), optionId]);
      }
    } else {
      form.setValue("value", [optionId]);
    }
  };

  useKeyboardOptionSelection({
    totalOptions: options.length,
    onSelectOption: handleSelectOption,
  });

  return (
    <div className="w-full pt-2">
      <FormField
        control={form.control}
        name="value"
        render={({ field, fieldState }) => (
          <>
            <div>
              <div
                className={cn(
                  "grid grid-cols-1 sm:inline-flex min-w-56 max-w-full sm:flex-col flex-wrap gap-3 pb-1",
                  {
                    "sm:grid sm:grid-cols-3":
                      orientation === "horizontal" || page.imageChoices,
                  }
                )}
              >
                {options.map((option, index) => (
                  <ChoiceOptionItem
                    page={page}
                    active={field.value?.includes(option.id)}
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
                    key={option.id}
                    option={option}
                    index={index}
                  />
                ))}
              </div>
            </div>
            {fieldState.error && (
              <FieldValidationErrorViewer>
                {fieldState.error.message}
              </FieldValidationErrorViewer>
            )}
          </>
        )}
      />
    </div>
  );
}
