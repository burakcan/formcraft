import { CheckIcon, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { ThemeCard } from "./ThemeCard";
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
import type { CraftTheme } from "@/craftPages/schemas/theming";
import { useSaveCustomThemeMutation } from "@/hooks/useSaveCustomThemeMutation";

interface Props {
  data: CraftTheme;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveThemeModal(props: Props) {
  const { data, open, onOpenChange } = props;
  const mutation = useSaveCustomThemeMutation();

  const form = useForm({
    defaultValues: {
      themeName: data.name,
    },
    mode: "onSubmit",
    disabled: mutation.isPending,
  });

  const handleSubmit = (values: { themeName: string }) => {
    mutation.mutate(
      {
        ...data,
        name: values.themeName,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit existing theme</DialogTitle>
          <DialogDescription>
            Are you sure you want to save changes? All pages across all forms
            using this theme will use the new settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex gap-4 justify-stretch">
              <div className="flex-none">
                <ThemeCard hideName large theme={data} />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="themeName"
                  rules={{ required: "Theme name is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Theme name</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="Enter theme name"
                          className={
                            fieldState.error ? "border-destructive" : ""
                          }
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
