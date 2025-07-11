import type { Path, UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { isMobile } from "@/lib/utils";
import { FieldValidationErrorViewer } from "../FieldValidationError";

interface Props<T extends { value: string }> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

export function PhoneNumberFieldViewer<T extends { value: string }>(
  props: Props<T>
) {
  const { form, name } = props;
  const autofocus = !isMobile();

  return (
    <div className="w-full pt-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <PhoneInput {...field} international autoFocus={autofocus} />
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
