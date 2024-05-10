import type { InputHTMLAttributes } from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldValidationErrorViewer } from "../FieldValidationError";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type InputValue = InputHTMLAttributes<HTMLInputElement>["value"];

interface Props<T extends { value: InputValue }> {
  form: UseFormReturn<T>;
  name: Path<T>;
  type?: "text" | "number" | "email" | "tel" | "url";
  placeholder?: string;
  format?: (value: string) => InputValue;
}

export function ShortInputViewer<T extends { value: InputValue }>(
  props: Props<T>
) {
  const { form, name, type, placeholder, format = (v) => v } = props;
  const autofocus = !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );

  return (
    <div className="w-full pt-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(format(e.target.value));
                }}
                value={field.value === 0 ? 0 : field.value || ""}
                autoFocus={autofocus}
                className={cn(
                  "text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
                )}
                placeholder={placeholder || "Type your answer here..."}
                type={type}
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
  );
}
