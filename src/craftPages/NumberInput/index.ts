import { isNil } from "lodash";
import { HashIcon } from "lucide-react";
import { NumberInputContentSettings } from "./ContentSettings";
import { NumberInputEditor } from "./EditorComponent";
import type { NumberInput, NumberInputValue } from "./schema";
import { getNumberInputViewerSchema, numberInputEditorSchema } from "./schema";
import { NumberInputViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<NumberInput, NumberInputValue> =
  {
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
        fn: (page, value) => (isNil(value) ? undefined : String(value)),
      },
    ],
  };

export default pageDefinition;
