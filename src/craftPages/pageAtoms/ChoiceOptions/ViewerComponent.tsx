import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldValidationErrorViewer } from "../FieldValidationError";
import { ChoiceLetter } from "./ChoiceLetter";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import type { PageWithOptions } from "@/hooks/useChoiceOptionEditor";

type ValueType = string[];

interface Props<T extends PageWithOptions> {
  page: T;
  form: UseFormReturn<{
    value: ValueType;
  }>;
}

interface ItemProps {
  option: { label: string; id: string };
  index: number;
  active?: boolean;
  onClick?: () => void;
}

function ChoiceOptionItem(props: ItemProps) {
  const { option, index, active, onClick } = props;

  return (
    <Button
      type="button"
      variant="choiceOption"
      onClick={onClick}
      className={cn(
        "h-auto min-h-10 pl-0 pr-2 gap-2 whitespace-normal transition-colors",
        {
          "bg-craft-answers/30 hover:bg-craft-answers/30": active,
        }
      )}
    >
      <ChoiceLetter index={index} active={active} />
      <span className="max-w-full flex-auto break-all brightness-75">
        {option.label}
      </span>
    </Button>
  );
}

export function ChoiceOptionsViewer<
  T extends PageWithOptions & {
    orientation: "vertical" | "horizontal";
    multiple: boolean;
  }
>(props: Props<T>) {
  const { page, form } = props;
  const { options, orientation } = page;

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
                  "inline-flex min-w-56 max-w-full flex-col flex-wrap gap-3 pb-1",
                  {
                    "grid grid-cols-3": orientation === "horizontal",
                  }
                )}
              >
                {options.map((option, index) => (
                  <ChoiceOptionItem
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
