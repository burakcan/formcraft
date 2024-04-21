import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { DocumentWithTitleDescriptionKit } from "@/lib/tiptap/DocumentWithTitleDescription";

export function useBaseContentEditor<T extends FormCraft.CraftPage>(
  page: T,
  onChange: (pageId: string, page: T) => void
) {
  const editor = useEditor({
    extensions: DocumentWithTitleDescriptionKit,
    content: `
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    `,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (!content) return;

      const title = editor.$node("title")?.textContent || "";
      const description = editor.$node("description")?.textContent || "";

      onChange(page.id, {
        ...page,
        title,
        description,
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
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    `);
  }, [editor, page.title, page.description]);

  return editor;
}
