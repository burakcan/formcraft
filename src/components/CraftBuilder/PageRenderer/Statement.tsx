"use client";

import { useRef } from "react";
import type { Statement } from "@/lib/craftPageConfig";

interface Props {
  page: Statement;
  onChange: (pageId: string, page: Statement) => void;
}

export function StatementRenderer(props: Props) {
  const { page, onChange } = props;
  const initialTitle = useRef(page.title).current;

  const handleTitleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    onChange(page.id, {
      ...page,
      title: e.target.innerText,
    });
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    if (e.target.innerText === "") {
      onChange(page.id, {
        ...page,
        title: "Untitled",
      });

      e.target.innerText = "Untitled";
    }
  };

  return (
    <div className="size-full flex flex-col items-center justify-center text-center p-16">
      <h1
        className="text-4xl font-bold mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none break-all"
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        onInput={handleTitleChange}
        onBlur={handleTitleBlur}
      >
        {initialTitle}
      </h1>
      <p
        className="text-lg"
        contentEditable="plaintext-only"
        suppressContentEditableWarning
      >
        {page.description || "No description"}
      </p>
    </div>
  );
}
