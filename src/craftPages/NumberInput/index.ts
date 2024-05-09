import { TextCursorInput } from "lucide-react";
import { NumberInputContentSettings } from "./ContentSettings";
import { NumberInputEditor } from "./EditorComponent";
import { getNumberInputViewerSchema, numberInputEditorSchema } from "./schema";
import { NumberInputViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Number",
  description: "A number input",

  editorComponent: NumberInputEditor,
  editorSchema: numberInputEditorSchema,
  viewerComponent: NumberInputViewer,
  getViewerSchema: getNumberInputViewerSchema,
  settingsComponent: NumberInputContentSettings,

  icon: TextCursorInput,
  iconClassName: "bg-amber-100",
};

export default pageDefinition;
