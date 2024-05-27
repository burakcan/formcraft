import { BookOpen } from "lucide-react";
import { LongTextContentSettings } from "./ContentSettings";
import { LongTextEditor } from "./EditorComponent";
import type { LongText, LongTextValue } from "./schema";
import { getLongTextViewerSchema, longTextEditorSchema } from "./schema";
import { LongTextViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Long text",
  description: "Multi line text input",

  editorComponent: LongTextEditor,
  editorSchema: longTextEditorSchema,
  viewerComponent: LongTextViewer,
  getViewerSchema: getLongTextViewerSchema,
  settingsComponent: LongTextContentSettings,

  icon: BookOpen,
  iconClassName: "bg-amber-100",

  recall: [
    {
      label: "value",
      fn: (page: LongText, value: LongTextValue) => value,
    },
  ],
};

export default pageDefinition;
