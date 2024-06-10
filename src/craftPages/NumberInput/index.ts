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

    comparisons: [
      {
        id: "num_eq",
        type: "number",
        label: "equals",
        operator: (value, b: number) => value === b,
      },
      {
        id: "num_ne",
        type: "number",
        label: "does not equal",
        operator: (value, b: number) => value !== b,
      },
      {
        id: "num_gt",
        type: "number",
        label: "is greater than",
        operator: (value, b: number) => value > b,
      },
      {
        id: "num_gte",
        type: "number",
        label: "is greater than or equal to",
        operator: (value, b: number) => value >= b,
      },
      {
        id: "num_lt",
        type: "number",
        label: "is less than",
        operator: (value, b: number) => value < b,
      },
      {
        id: "num_lte",
        type: "number",
        label: "is less than or equal to",
        operator: (value, b: number) => value <= b,
      },
    ],

    recall: [
      {
        label: "answer",
        fn: (page, value) => (isNil(value) ? undefined : String(value)),
      },
    ],
  };

export default pageDefinition;
