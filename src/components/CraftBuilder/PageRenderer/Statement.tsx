"use client";

import { EditorContent } from "@tiptap/react";
import type { Statement } from "@/lib/craftPageConfig";
import { Button } from "@/components/ui/button";
import { useCtaEditor } from "@/hooks/useCtaEditor";
import { useTitleDescriptionEditor } from "@/hooks/useTitleDescriptionEditor";

interface Props {
  page: Statement;
  onChange: (pageId: string, page: Statement) => void;
}

export function StatementRenderer(props: Props) {
  const { page, onChange } = props;
  const editor = useTitleDescriptionEditor(page, onChange);
  const ctaEditor = useCtaEditor(page, onChange);

  return (
    <div className="size-full flex flex-col items-center justify-center p-16 break-before-all">
      <EditorContent editor={editor} />
      <Button variant="craft" size="editable" className="mt-2" tabIndex={-1}>
        <EditorContent editor={ctaEditor} />
      </Button>
    </div>
  );
}
