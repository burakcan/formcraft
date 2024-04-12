"use client";

import { Document } from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import { useEditor, EditorContent } from "@tiptap/react";
import { CheckIcon } from "lucide-react";
import type { ShortText } from "@/lib/craftPageConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paragraph } from "@tiptap/extension-paragraph";

interface Props {
  page: ShortText;
  onChange: (pageId: string, page: ShortText) => void;
}

const Title = Heading.extend({
  name: "title",
  group: "title",
  parseHTML: () => [{ tag: "h1:first-child" }],
}).configure({
  levels: [1],
  HTMLAttributes: {
    class: "text-3xl font-bold mb-4",
  },
});

const Description = Paragraph.extend({
  name: "description",
  group: "block",
  content: "text*",
  parseHTML: () => [{ tag: "p" }],
}).configure({
  HTMLAttributes: {
    class: "text-base",
  },
});

const DocumentWithTitle = Document.extend({
  content: "title block",
});

export function ShortTextRenderer(props: Props) {
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
    <div className="size-full flex flex-col justify-center p-16 break-all">
      <EditorContent editor={editor} />
      <Input
        className="mt-4 text-xl h-16"
        placeholder="Type your answer here..."
      />
      <div className="mt-2 text-sm">
        <Button className="mr-2">
          Confirm
          <CheckIcon className="ml-2 size-4" />
        </Button>
        or press <kbd>Enter</kbd>
      </div>
    </div>
  );
}
