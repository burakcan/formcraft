"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Dropdown } from "./schema";

interface Props {
    page: Dropdown;
    value?: string[];
    error?: string;
    onChange?: (value: string[]) => void;
    disabled?: boolean;
}

export function DropdownViewer({
    page,
    value = [],
    error,
    onChange,
    disabled,
}: Props) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className={cn(page.required && "after:content-['*'] after:ml-1 after:text-destructive")}>
                    {page.title}
                </Label>
                {page.description && (
                    <div className="text-sm text-muted-foreground">
                        {page.description}
                    </div>
                )}
            </div>

            <Select
                disabled={disabled}
                value={value[0]}
                onValueChange={(val) => onChange?.([val])}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={page.placeholder ?? "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                    {page.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
}