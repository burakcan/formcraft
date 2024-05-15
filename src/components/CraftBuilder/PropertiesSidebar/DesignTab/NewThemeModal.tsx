import { CheckIcon, LoaderCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
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
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useSaveCustomThemeMutation } from "@/hooks/useSaveCustomThemeMutation";
import { ThemeCard } from "./ThemeCard";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  selectedPage: FormCraft.CraftPage;
  data: CraftTheme;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function NewThemeModal(props: Props) {
  const { data, open, onOpenChange, selectedPage, onSave } = props;
  const mutation = useSaveCustomThemeMutation();
  const { editPage } = useEditCraftStore((s) => ({
    editPage: s.editPage,
  }));

  const form = useForm({
    defaultValues: {
      themeName: "",
    },
    mode: "onSubmit",
    disabled: mutation.isPending,
  });

  const handleSubmit = (values: { themeName: string }) => {
    mutation.mutate(
      {
        ...data,
        id: nanoid(5),
        name: values.themeName,
      },
      {
        onSuccess: (response) => {
          editPage(selectedPage.id, {
            ...selectedPage,
            baseThemeId: response.data.id,
            themeOverride: {},
          });

          onSave();
        },
      }
    );
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as new theme</DialogTitle>
          <DialogDescription>
            Save the current theme as a new theme. You can then reuse this theme
            in other pages or forms.
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
