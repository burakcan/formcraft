import { TextCursorInput } from "lucide-react";
import { ShortTextContentSettings } from "./ContentSettings";
import { ShortTextEditor } from "./EditorComponent";
import type { ShortText, ShortTextValue } from "./schema";
import { getShortTextViewerSchema, shortTextEditorSchema } from "./schema";
import { ShortTextViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<ShortText, ShortTextValue> = {
  name: "Short text",
  description: "A single line of text",

  editorComponent: ShortTextEditor,
  editorSchema: shortTextEditorSchema,
  viewerComponent: ShortTextViewer,
  getViewerSchema: getShortTextViewerSchema,
  settingsComponent: ShortTextContentSettings,

  icon: TextCursorInput,
  iconClassName: "bg-amber-100",

  recall: [
    {
      label: "answer",
      fn: (page, value) => value,
    },
  ],

  comparisons: [
    {
      id: "shorttext_eq",
      type: "text",
      label: "is",
      operator: (value, b: string) => value === b,
    },
    {
      id: "shorttext_ne",
      type: "text",
      label: "is not",
      operator: (value, b: string) => value !== b,
    },
    {
      id: "shorttext_contains",
      type: "text",
      label: "contains",
      operator: (value, b: string) => value.includes(b),
    },
    {
      id: "shorttext_not_contains",
      type: "text",
      label: "does not contain",
      operator: (value, b: string) => !value.includes(b),
    },
    {
      id: "shorttext_starts_with",
      type: "text",
      label: "starts with",
      operator: (value, b: string) => value.startsWith(b),
    },
    {
      id: "shorttext_ends_with",
      type: "text",
      label: "ends with",
      operator: (value, b: string) => value.endsWith(b),
    },
  ],
};

export default pageDefinition;
