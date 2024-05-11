import { Document } from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";

export type PageWithOptions = FormCraft.CraftPage & {
  options: { label: string; id: string }[];
};

export function useChoiceOptionEditor<T extends PageWithOptions>(
  page: T,
  option: T["options"][number],
  onChange: (pageId: string, page: T) => void
) {
  const editor = useEditor({
    extensions: [
      Document.extend({
        content: "text*",
      }),
      Text,
    ],
    content: option.label,
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      if (!content) return;

      onChange(page.id, {
        ...page,
        options: page.options.map((o) =>
          o.id === option.id ? { ...o, label: content } : o
        ),
      });
    },
    onFocus: ({ editor }) => {
      editor.commands.setTextSelection(0);
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.isFocused) {
      return;
    }

    editor.commands.setContent(`
      ${option.label}
    `);
  }, [editor, option.label]);

  return editor;
}
