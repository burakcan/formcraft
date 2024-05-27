import type { JSONContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { DocumentWithTitleDescriptionKit } from "@/lib/tiptap/DocumentWithTitleDescription";
import { recallExtension } from "@/lib/tiptap/recallExtension";

function jsonToString(content: JSONContent[]) {
  return content.reduce((acc, node) => {
    if (node.type === "text") {
      return acc + node.text;
    }

    if (node.type === "recall") {
      return acc + "_";
    }

    return acc;
  }, "");
}

export function useBaseContentEditor<T extends FormCraft.CraftPage>(
  page: T,
  onChange: (pageId: string, page: T) => void
) {
  const editor = useEditor({
    extensions: [...DocumentWithTitleDescriptionKit, recallExtension],
    content: `
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    `,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (!content) return;

      const json = editor.getJSON();
      const titleJson = (json.content || [])[0].content || [];
      const descriptionJson = (json.content || [])[1].content || [];

      const title = jsonToString(titleJson);
      const description = jsonToString(descriptionJson);

      onChange(page.id, {
        ...page,
        title,
        description,
        baseContent: json,
      });
    },
    onFocus: ({ editor }) => {
      editor.commands.setTextSelection(0);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const json = editor.getJSON();
    const titleJson = (json.content || [])[0].content || [];
    const descriptionJson = (json.content || [])[1].content || [];

    const title = jsonToString(titleJson);
    const description = jsonToString(descriptionJson);

    if (
      page.title === title &&
      page.description === description &&
      isEqual(json, page.baseContent)
    ) {
      return;
    }

    queueMicrotask(() => {
      editor.commands.setContent(
        page.baseContent
          ? [page.baseContent]
          : `
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    `
      );
    });
  }, [editor, page.title, page.description, page.baseContent]);

  return editor;
}
