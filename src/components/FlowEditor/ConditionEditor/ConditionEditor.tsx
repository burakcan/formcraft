import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ComparisonSelector } from "./ComparisonSelector";
import { SourceSelector } from "./SourceSelector";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condition?: Condition.ConditionItem;
  onConfirm: (condition: Condition.ConditionItem) => void;
}

type FieldValues = Condition.ConditionItem;

export function ConditionEditor(props: Props) {
  const { open, onOpenChange, onConfirm, condition } = props;
  const formId = "conditionEditorForm";

  const form = useForm<FieldValues>({
    defaultValues: condition || {
      id: undefined,
      sourceId: "",
      sourceType: "page",
      comparisonId: "",
      comparisonValue: "",
    },
    mode: "all",
  });

  useEffect(() => {
    form.reset();
  }, [form, open]);

  const handleSubmit = form.handleSubmit((values) => {
    onConfirm({
      ...values,
      id: values.id || `cnd-${nanoid(5)}`,
    });
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add condition</DialogTitle>
          <DialogDescription>
            Add a condition to determine which path to take
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              id={formId}
              className="flex flex-col gap-2"
            >
              <SourceSelector />
              <ComparisonSelector />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            form={formId}
            type="submit"
            disabled={!form.formState.isValid}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
