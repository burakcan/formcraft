"use client";

import { CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { ChoiceOptionsEditor } from "../pageAtoms/ChoiceOptions";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { Dropdown } from "./schema";

interface Props {
    page: Dropdown;
    onChange: (pageId: string, page: Dropdown) => void;
}

export function DropdownEditor({ page, onChange }: Props) {
    return (
        <PageWrapperEditor>
            <BaseContentEditor page={page} onChange={onChange} />

            <div className="w-full px-2 pt-2">
                <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                        value={page.placeholder ?? ""}
                        onChange={(e) =>
                            onChange(page.id, { ...page, placeholder: e.target.value })
                        }
                        placeholder="Select an option..."
                    />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <Switch
                        id="required"
                        checked={page.required}
                        onCheckedChange={(required) =>
                            onChange(page.id, { ...page, required })
                        }
                    />
                    <Label htmlFor="required">Required</Label>
                </div>
            </div>

            <ChoiceOptionsEditor page={page} onChange={onChange} />
            <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
        </PageWrapperEditor>
    );
}