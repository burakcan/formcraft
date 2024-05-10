"use client";

import { CheckIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { BaseContentEditor } from "../pageAtoms/BaseContent";
import { CtaSectionEditor } from "../pageAtoms/CtaSection";
import { PageWrapperEditor } from "../pageAtoms/PageWrapper";
import type { Choices } from "./schema";

interface Props {
  page: Choices;
  onChange: (pageId: string, page: Choices) => void;
}

export function ChoicesEditor(props: Props) {
  const { page, onChange } = props;

  return (
    <PageWrapperEditor>
      <BaseContentEditor page={page} onChange={onChange} />
      <div className="w-full px-2 pt-2">
        {page.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={option.label}
                onChange={(e) => {
                  const newOptions = [...page.options];
                  newOptions[index] = { ...option, label: e.target.value };
                  onChange(page.id, { ...page, options: newOptions });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => {
                const newOptions = [...page.options];
                newOptions.splice(index, 1);
                onChange(page.id, { ...page, options: newOptions });
              }}
              className="p-2 text-red-500 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            onChange(page.id, {
              ...page,
              options: [...page.options, { label: "", id: nanoid(3) }],
            });
          }}
          className="p-2 mt-2 text-green-500 rounded-md"
        >
          Add option
        </button>
      </div>
      <CtaSectionEditor page={page} onChange={onChange} icon={CheckIcon} />
    </PageWrapperEditor>
  );
}
