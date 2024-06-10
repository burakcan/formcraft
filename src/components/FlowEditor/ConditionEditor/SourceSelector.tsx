import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { IconType } from "react-icons";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";

type VariableSourceOption = {
  id: string;
  label: string;
};

type PageSourceOption = {
  id: string;
  label: string;
  icon: LucideIcon | IconType;
  iconClassName: string;
  pageIndex: number;
};

export function SourceSelector() {
  const pages = useEditCraftStore((s) => s.editingVersion.data.pages);
  const form = useFormContext<Condition.ConditionItem>();
  const watchSourceType = form.watch("sourceType");

  const onSourceTypeChange = (value: Condition.ConditionItem["sourceType"]) => {
    form.setValue("sourceId", "");
    form.setValue("sourceType", value);
    form.setValue("comparisonId", "");
    form.setValue("comparisonValue", "");
  };

  const onSourceIdChange = (value: string) => {
    form.setValue("sourceId", value);
    form.setValue("comparisonId", "");
    form.setValue("comparisonValue", "");
  };

  const sourceOptions: (PageSourceOption | VariableSourceOption)[] =
    useMemo(() => {
      if (watchSourceType === "variable") {
        return [];
      }

      return pages
        .filter((page) => {
          const pageDefiniton = craftPageDefinitions[page.type];

          if (!pageDefiniton.comparisons || !pageDefiniton.comparisons.length) {
            return false;
          }

          return true;
        })
        .map((page) => {
          const pageDefiniton = craftPageDefinitions[page.type];
          const pageIndex = pages.findIndex((p) => p.id === page.id);

          return {
            type: "page",
            id: page.id,
            label: page.title || "",
            pageIndex: pageIndex,
            icon: pageDefiniton.icon,
            iconClassName: pageDefiniton.iconClassName,
          };
        })
        .filter(Boolean);
    }, [pages, watchSourceType]);

  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name="sourceType"
        rules={{
          required: "Source type is required",
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select value={field.value} onValueChange={onSourceTypeChange}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="page">Answer to</SelectItem>
                    <SelectItem value="variable" disabled>
                      Variable (coming soon)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sourceId"
        rules={{
          required: "Source is required",
        }}
        render={({ field, fieldState }) => (
          <FormItem className="flex-auto">
            <FormControl>
              <Select value={field.value} onValueChange={onSourceIdChange}>
                <SelectTrigger
                  className={cn(
                    "text-left",
                    fieldState.error && "border  border-rose-500"
                  )}
                >
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((option) => {
                    const Icon = "icon" in option ? option.icon : undefined;

                    const pageIndex =
                      "pageIndex" in option ? option.pageIndex : undefined;

                    const iconClassName =
                      "iconClassName" in option
                        ? option.iconClassName
                        : undefined;

                    return (
                      <SelectItem key={option.id} value={option.id}>
                        {Icon && (
                          <Icon
                            className={cn(
                              "inline-block p-1 size-5 rounded-md mr-2 flex-none",
                              iconClassName
                            )}
                          />
                        )}
                        {pageIndex !== undefined && (
                          <strong>{pageIndex + 1}.</strong>
                        )}
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
