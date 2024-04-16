import { Document } from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";

export function useCtaEditor<T extends FormCraft.CraftPage & { cta?: string }>(
  page: T,
  onChange: (pageId: string, page: T) => void
) {
  const editor = useEditor({
    extensions: [
      Document.extend({
        content: "text*",
      }),
      Text,
    ],
    content: page.cta,
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      if (!content) return;

      onChange(page.id, {
        ...page,
        cta: content,
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
      ${page.cta}
    `);
  }, [editor, page.cta]);

  return editor;
}
