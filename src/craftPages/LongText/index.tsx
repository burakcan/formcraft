import { BookOpen } from "lucide-react";
import { LongTextContentSettings } from "./ContentSettings";
import { LongTextEditor } from "./EditorComponent";
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
};

export default pageDefinition;
