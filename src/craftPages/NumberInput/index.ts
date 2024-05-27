import { HashIcon } from "lucide-react";
import { NumberInputContentSettings } from "./ContentSettings";
import { NumberInputEditor } from "./EditorComponent";
import type { NumberInput, NumberInputValue } from "./schema";
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

  icon: HashIcon,
  iconClassName: "bg-amber-100",

  recall: [
    {
      label: "answer",
      fn: (page: NumberInput, value: NumberInputValue) => value,
    },
  ],
};

export default pageDefinition;
