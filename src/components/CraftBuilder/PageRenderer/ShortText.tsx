"use client";

import { EditorContent } from "@tiptap/react";
import { CheckIcon } from "lucide-react";
import type { ShortText } from "@/lib/craftPageConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCtaEditor } from "@/hooks/useCtaEditor";
import { useTitleDescriptionEditor } from "@/hooks/useTitleDescriptionEditor";

interface Props {
  page: ShortText;
  onChange: (pageId: string, page: ShortText) => void;
}

export function ShortTextRenderer(props: Props) {
  const { page, onChange } = props;
  const editor = useTitleDescriptionEditor(page, onChange);
  const ctaEditor = useCtaEditor(page, onChange);

  return (
    <div className="size-full flex flex-col justify-center p-16 break-all">
      <EditorContent editor={editor} />
      <Input
        className="mt-4 text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
        placeholder="Type your answer here..."
      />
      <div className="mt-4 text-sm">
        <Button variant="craft" size="editable" className="mr-2">
          <EditorContent editor={ctaEditor} />
          <CheckIcon className="mx-2 size-4" />
        </Button>
        or press <kbd>Enter</kbd>
      </div>
    </div>
  );
}
