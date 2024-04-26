import { EditorContent } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCtaEditor } from "@/hooks/useCtaEditor";

interface Props<T extends FormCraft.CraftPage> {
  page: T;
  onChange: (pageId: string, page: T) => void;
  icon?: LucideIcon;
}

export function CtaButtonEditor<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { page, onChange } = props;
  const editor = useCtaEditor(page, onChange);

  return (
    <Button variant="craft" size="editable" tabIndex={-1}>
      <EditorContent editor={editor} />
      {props.icon && <props.icon className="mx-2 size-4" />}
    </Button>
  );
}
