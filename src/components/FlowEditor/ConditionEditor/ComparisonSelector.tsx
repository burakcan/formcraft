import { useFormContext } from "react-hook-form";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";

export function ComparisonSelector() {
  const form = useFormContext<Condition.ConditionItem>();
  const watchSourceType = form.watch("sourceType");
  const watchSourceId = form.watch("sourceId");
  const watchComparisonId = form.watch("comparisonId");
  const page = useEditCraftStore((s) => {
    if (watchSourceType === "page") {
      return s.editingVersion.data.pages.find((p) => p.id === watchSourceId);
    }

    return null;
  });

  if (!page) {
    // TODO: handle variable comparisons
    return null;
  }

  const pageDefiniton = craftPageDefinitions[page.type];
  const comparisons = pageDefiniton.comparisons || [];

  const handleComparisonIdChange = (comparisonId: string) => {
    form.setValue("comparisonId", comparisonId);
    form.setValue("comparisonValue", "");
  };

  const selectedComparison = comparisons.find(
    (comparison) => comparison.id === watchComparisonId
  );

  const ComparisonValueComponent = {
    text: TextComparisonValue,
    choice: ChoiceComparisonValue,
    number: NumberComparisonValue,
    date: TextComparisonValue,
    __none__: NoneComparisonValue,
  }[selectedComparison?.type || "__none__"];

  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name="comparisonId"
        rules={{
          required: "Comparison is required",
        }}
        render={({ field, fieldState }) => (
          <FormItem className="flex-none">
            <FormControl>
              <Select
                value={field.value}
                onValueChange={handleComparisonIdChange}
              >
                <SelectTrigger
                  className={cn(
                    "text-left w-44",
                    fieldState.error && "border  border-rose-500"
                  )}
                >
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {comparisons.map((comparison) => {
                    const isMultiple =
                      "getIsMultiple" in comparison &&
                      comparison.getIsMultiple(page as any);

                    const label =
                      typeof comparison.label === "string"
                        ? comparison.label
                        : comparison.label[isMultiple ? "multiple" : "single"];

                    return (
                      <SelectItem key={comparison.id} value={comparison.id}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <ComparisonValueComponent />
    </div>
  );
}

function ChoiceComparisonValue() {
  const form = useFormContext<Condition.ConditionItem>();
  const watchSourceType = form.watch("sourceType");
  const watchSourceId = form.watch("sourceId");
  const watchComparisonId = form.watch("comparisonId");

  const page = useEditCraftStore((s) => {
    if (watchSourceType === "page") {
      return s.editingVersion.data.pages.find((p) => p.id === watchSourceId);
    }

    return null;
  });

  if (!page) {
    // TODO: handle variable comparisons
    return null;
  }

  const pageDefiniton = craftPageDefinitions[page.type];
  const comparisons = pageDefiniton.comparisons || [];
  const selectedComparison = comparisons.find(
    (comparison) => comparison.id === watchComparisonId
  );

  if (!selectedComparison) {
    return null;
  }

  const options =
    "getOptions" in selectedComparison
      ? selectedComparison.getOptions(page as any)
      : [];

  const multiple =
    "getIsMultiple" in selectedComparison &&
    selectedComparison.getIsMultiple(page as any);

  const multiselectOptions = options.map((o) => ({
    value: o.id,
    label: o.label,
  }));

  return (
    <FormField
      control={form.control}
      name="comparisonValue"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormControl>
            {multiple ? (
              <FancyMultiSelect
                value={
                  field.value
                    ? (field.value as string[]).map((v) => {
                        const option = options.find((o) => o.id === v)!;

                        return {
                          value: option.id,
                          label: option.label,
                        };
                      })
                    : []
                }
                onChange={(value) => field.onChange(value.map((o) => o.value))}
                options={multiselectOptions}
                placeholder="Choose options"
              />
            ) : (
              <Select
                value={(field.value as string[])[0]}
                onValueChange={(value) => {
                  field.onChange([value]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => {
                    return (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function TextComparisonValue() {
  const form = useFormContext<Condition.ConditionItem>();

  return (
    <FormField
      control={form.control}
      name="comparisonValue"
      rules={{ required: false }}
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormControl>
            <Input
              value={field.value as string}
              onChange={field.onChange}
              placeholder="Enter value"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function NumberComparisonValue() {
  const form = useFormContext<Condition.ConditionItem>();

  return (
    <FormField
      control={form.control}
      name="comparisonValue"
      rules={{ required: false }}
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormControl>
            <Input
              type="number"
              value={field.value as string}
              onChange={field.onChange}
              placeholder="Enter value"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function NoneComparisonValue() {
  return <div className="flex-auto text-sm"></div>;
}
