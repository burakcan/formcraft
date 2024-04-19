import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onConfirm: (condition: FormCraft.BranchingCondition) => void;
  trigger?: React.ReactNode;
  condition?: FormCraft.BranchingCondition;
}

export const conditionLabels: Record<FormCraft.BranchingConditionType, string> =
  {
    eq: "Equals",
    neq: "Not equals",
    gt: "Greater than",
    lt: "Less than",
    gte: "Greater than or equals",
    lte: "Less than or equals",
    contains: "Contains",
    not_contains: "Not contains",
    starts_with: "Starts with",
    ends_with: "Ends with",
  };

export function ConditionEditor(props: Props) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const { onConfirm, trigger, condition } = props;
  const form = useForm<FormCraft.BranchingCondition>({
    defaultValues: condition || {
      id: uuid(),
      source: "input",
      condition: "eq",
      value: "",
    },
  });

  const formValues = form.watch();

  const handleSubmit = (values: FormCraft.BranchingCondition) => {
    onConfirm(values);
    setOpen(false);
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset(
          condition || {
            id: uuid(),
            source: "input",
            condition: "eq",
            value: "",
          }
        );
        setOpen(!open);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="secondary" className="text-sm h-8 w-full">
            Add condition
          </Button>
        )}
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add condition</DialogTitle>
              <DialogDescription>
                Add a condition to determine which path to take
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 flex flex-col gap-2 justify-stretch">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Source</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {field.value === "input" ? "Input" : "Variable"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="input">Input</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              {formValues.source === "variable" && (
                <FormField
                  control={form.control}
                  name="variableName"
                  rules={{ required: "Variable name is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Variable name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className={
                            fieldState.error ? "border-destructive" : ""
                          }
                          placeholder="Variable name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Condition</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {conditionLabels[field.value]}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(conditionLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Value to compare" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button form={formId} type="submit">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
