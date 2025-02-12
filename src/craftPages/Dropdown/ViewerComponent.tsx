"use client";

import { CheckIcon } from "lucide-react";
import { ChevronsUpDown, CheckIcon as CheckIconLucide, X } from "lucide-react";
import { useState, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { FieldValidationErrorViewer } from "../pageAtoms/FieldValidationError";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import type { Dropdown } from "./schema";

type ValueType = string[];

interface Props {
  page: Dropdown;
}

interface ControlProps {
  page: Dropdown;
  form: UseFormReturn<{
    value: ValueType;
  }>;
}

function SearchableDropdown({
  page,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  page: Dropdown;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = page.options.find((option) => option.id === value);

  const options = useMemo(() => {
    if (!page.randomize) return page.options;
    return [...page.options].sort(() => Math.random() - 0.5);
  }, [page.options, page.randomize]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-controls={open ? "command-listbox" : undefined}
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-craft-answers/30 bg-craft-answers/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-craft-answers/20 focus:outline-none focus:ring-2 focus:ring-craft-answers focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "cursor-not-allowed opacity-50"
          )}
          aria-disabled={disabled}
        >
          <span className="flex-1 truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && page.clearable && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command className="border border-craft-answers/30">
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option.label}
                onSelect={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="aria-selected:bg-craft-answers/30"
              >
                <CheckIconLucide
                  className={cn(
                    "mr-2 h-4 w-4 text-craft-answers",
                    value === option.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DropdownControl({ page, form }: ControlProps) {
  return (
    <div className="space-y-4 pt-2">
      <FormField
        control={form.control}
        name="value"
        render={({ field, fieldState }) => (
          <>
            <SearchableDropdown
              page={page}
              value={field.value?.[0] ?? ""}
              onChange={(val) => field.onChange(val ? [val] : [])}
              disabled={form.formState.isSubmitting}
              placeholder={page.placeholder ?? "Select an option"}
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
  );
}

export function DropdownViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <div className="space-y-6">
            <DropdownControl page={page} form={form} />
          </div>
          <CtaSectionViewer page={page} icon={CheckIcon} form={formDomId} />
        </>
      )}
    </PageWrapperViewer>
  );
}
