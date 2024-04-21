import { EditorContent } from "@tiptap/react";
import { useBaseContentEditor } from "@/hooks/useBaseContentEditor";

interface Props<T extends FormCraft.CraftPage> {
  page: T;
  onChange: (pageId: string, page: T) => void;
}

export function BaseContent<T extends FormCraft.CraftPage>(props: Props<T>) {
  const { page, onChange } = props;
  const editor = useBaseContentEditor(page, onChange);

  return <EditorContent className="w-full" editor={editor} />;
}
