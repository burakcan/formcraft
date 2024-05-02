import { CheckIcon, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRenameCraftMutation } from "@/hooks/useRenameCraftMutation";

interface Props {
  data: { id: string; title: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameCraftModal(props: Props) {
  const { data, open, onOpenChange } = props;
  const mutation = useRenameCraftMutation();

  const form = useForm({
    defaultValues: {
      title: data.title,
    },
    mode: "onSubmit",
    disabled: mutation.isPending,
  });

  const handleSubmit = (values: { title: string }) => {
    mutation.mutate(
      {
        id: data.id,
        title: values.title,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Form renamed successfully");
        },
      }
    );
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Rename form</DialogTitle>
          <DialogDescription>
            Enter a new name for the form. This name is not visible to
            respondents.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Form name is required" }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Form name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Enter form name"
                      className={fieldState.error ? "border-destructive" : ""}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                Save
                {mutation.isPending ? (
                  <LoaderCircle className="animate-spin size-4 ml-2" />
                ) : (
                  <CheckIcon className="ml-2 size-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
