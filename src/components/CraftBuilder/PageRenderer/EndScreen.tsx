"use client";

import { EditorContent } from "@tiptap/react";
import type { EndScreen } from "@/lib/craftPageConfig";
import { Button } from "@/components/ui/button";
import { useTitleDescriptionEditor } from "@/hooks/useTitleDescriptionEditor";

interface Props {
  page: EndScreen;
  onChange: (pageId: string, page: EndScreen) => void;
}

export function EndScreenRenderer(props: Props) {
  const { page, onChange } = props;
  const editor = useTitleDescriptionEditor(page, onChange);

  return (
    <div className="size-full flex flex-col items-center justify-center p-16 break-before-all">
      <EditorContent editor={editor} />
      {page.cta && <Button className="mt-2">{page.cta}</Button>}
    </div>
  );
}
