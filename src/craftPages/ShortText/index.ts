import { TextCursorInput } from "lucide-react";
import { ShortTextContentSettings } from "./ContentSettings";
import { ShortTextEditor } from "./EditorComponent";
import { getShortTextViewerSchema, shortTextEditorSchema } from "./schema";
import { ShortTextViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Short text",
  description: "A single line of text",

  editorComponent: ShortTextEditor,
  editorSchema: shortTextEditorSchema,
  viewerComponent: ShortTextViewer,
  getViewerSchema: getShortTextViewerSchema,
  settingsComponent: ShortTextContentSettings,

  icon: TextCursorInput,
  iconClassName: "bg-amber-100",
};

export default pageDefinition;
