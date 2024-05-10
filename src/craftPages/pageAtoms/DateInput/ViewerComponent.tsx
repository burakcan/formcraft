import {
  useCallback,
  useMemo,
  type InputHTMLAttributes,
  type LegacyRef,
} from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import { IMask, useIMask } from "react-imask";
import { cn } from "@/lib/utils";
import { FieldValidationErrorViewer } from "../FieldValidationError";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlaceholder } from "@/craftPages/DateText/utils";

type InputValue = InputHTMLAttributes<HTMLInputElement>["value"];

interface Props<T extends { value: InputValue }> {
  form: UseFormReturn<T>;
  name: Path<T>;
  dateFormat: "MMDDYYYY" | "DDMMYYYY" | "YYYYMMDD";
  separator: "/" | "-" | ".";
}

export function DateInputViewer<T extends { value: InputValue }>(
  props: Props<T>
) {
  const { form, name, dateFormat, separator } = props;
  const placeholder = usePlaceholder(dateFormat, separator);

  const pattern = useMemo(() => {
    switch (dateFormat) {
      case "MMDDYYYY":
        return `m{${separator}}\`d{${separator}}\`Y`;
      case "DDMMYYYY":
        return `d{${separator}}\`m{${separator}}\`Y`;
      case "YYYYMMDD":
        return `Y{${separator}}\`m{${separator}}\`d`;
      default:
        return `d{${separator}}\`m{${separator}}\`Y`;
    }
  }, [dateFormat, separator]);

  const parse = useCallback(
    (str: string) => {
      const [first, second, third] = str.split(`${separator}`).map(Number);

      const [month, day, year] = {
        MMDDYYYY: [first, second, third],
        DDMMYYYY: [second, first, third],
        YYYYMMDD: [second, third, first],
      }[dateFormat];

      return new Date(Date.UTC(year, month - 1, day));
    },
    [dateFormat, separator]
  );

  const { ref, value } = useIMask(
    {
      mask: Date,
      placeholderChar: "_",
      lazy: false,
      pattern: pattern,
      blocks: {
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2,
          placeholderChar: "D",
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2,
          placeholderChar: "M",
        },
        Y: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: 9999,
          placeholderChar: "Y",
        },
      },
      format: (date: unknown) => {
        if (!(date instanceof Date)) return "";
        let day: string | number = date.getDate();
        let month: string | number = date.getMonth() + 1;
        const year = date.getFullYear();

        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;

        const arr = {
          MMDDYYYY: [month, day, year],
          DDMMYYYY: [day, month, year],
          YYYYMMDD: [year, month, day],
        }[dateFormat];

        return arr.join(`${separator}`);
      },
      parse,
    },
    {
      onAccept: (value) => {
        try {
          form.setValue(name, parse(value).toISOString() as any);
          form.trigger(name);
        } catch {
          form.setValue(name, "" as any);
        }
      },
      onComplete: (value) => {
        form.setValue(name, parse(value).toISOString() as any);
        form.trigger(name);
      },
    }
  );

  return (
    <div className="w-full pt-2 relative">
      <FormField
        control={form.control}
        name={name}
        render={({ fieldState }) => {
          return (
            <>
              <Input
                ref={ref as LegacyRef<HTMLInputElement> | undefined}
                autoFocus
                placeholder={placeholder}
                className={cn(
                  "text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers font-mono caret-black text-transparent"
                )}
              />
              <div className=" border border-transparent px-3 py-2 pointer-events-none absolute top-3 left-0 w-full h-13 text-xl text-transparent font-mono">
                {value.split("").map((char, index) => (
                  <span
                    key={index}
                    className={cn(
                      "text-foreground",
                      Number.isNaN(Number(char)) && "text-muted-foreground/50"
                    )}
                  >
                    {char}
                  </span>
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
