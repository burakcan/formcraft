import type { ReactNode } from "react";
import { InputField } from "../InputField";
import { SwitchField } from "../SwitchField";

interface Props<T> {
  // undefined = not set (field disabled)
  // null = set to null (field enabled)
  // T = set to T
  value: null | undefined | T;
  onChange: (value: null | undefined | T) => void;
  label: ReactNode;
  name: string;
  placeHolder: string;
  type?: "number" | "text";
  format?: (value: string) => T;
  min?: number;
  max?: number;
}

export function OptionalInputField<
  T extends number | string | null | undefined
>(props: Props<T>) {
  const {
    value,
    min,
    max,
    onChange,
    label,
    name,
    placeHolder,
    type,
    format = (v) => v,
  } = props;
  return (
    <div className="flex flex-col gap-1">
      <SwitchField
        label={label}
        name={name + "Enabled"}
        checked={value !== undefined}
        onCheckedChange={(newChecked) =>
          onChange(newChecked ? null : undefined)
        }
      />
      {value !== undefined && (
        <InputField
          type={type}
          placeholder={placeHolder}
          name={name}
          min={min}
          max={max}
          value={value === 0 ? 0 : value || ""}
          onChange={(e) =>
            onChange(
              e.target.value === ""
                ? null
                : (format(e.target.value) as null | undefined | T)
            )
          }
        />
      )}
    </div>
  );
}
