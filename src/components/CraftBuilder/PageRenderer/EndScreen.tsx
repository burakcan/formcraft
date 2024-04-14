"use client";

import { Document } from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import { useEditor, EditorContent } from "@tiptap/react";
import type { EndScreen } from "@/lib/craftPageConfig";
import { Button } from "@/components/ui/button";

interface Props {
  page: EndScreen;
  onChange: (pageId: string, page: EndScreen) => void;
}

const Title = Heading.extend({
  name: "title",
  group: "title",
  parseHTML: () => [{ tag: "h1:first-child" }],
}).configure({
  levels: [1],
  HTMLAttributes: {
    class: "text-3xl font-bold mb-4 text-center",
  },
});

const Description = Paragraph.extend({
  name: "description",
  group: "block",
  content: "text*",
  parseHTML: () => [{ tag: "p" }],
}).configure({
  HTMLAttributes: {
    class: "text-base text-center",
  },
});

const DocumentWithTitle = Document.extend({
  content: "title block",
});

export function EndScreenRenderer(props: Props) {
  const { page, onChange } = props;

  const editor = useEditor({
    extensions: [
      DocumentWithTitle,
      Title,
      Description,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "title") {
            return "Title";
          }

          if (node.type.name === "description") {
            return "Description...";
          }

          return "Write something...";
        },
        showOnlyCurrent: false,
      }),
      Text,
    ],
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

  return (
    <div className="size-full flex flex-col items-center justify-center p-16 break-all">
      <EditorContent editor={editor} />
      {page.cta && <Button className="mt-2">{page.cta}</Button>}
    </div>
  );
}
