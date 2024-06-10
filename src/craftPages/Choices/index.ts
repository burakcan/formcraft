import { CheckSquare2Icon } from "lucide-react";
import { ChoicesContentSettings } from "./ContentSettings";
import { ChoicesEditor } from "./EditorComponent";
import type { Choices, ChoicesValue } from "./schema";
import { getChoicesViewerSchema, choicesEditorSchema } from "./schema";
import { ChoicesViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<Choices, ChoicesValue> = {
  name: "Choices",
  description: "Choose from a list of options",

  editorComponent: ChoicesEditor,
  editorSchema: choicesEditorSchema,
  viewerComponent: ChoicesViewer,
  getViewerSchema: getChoicesViewerSchema,
  settingsComponent: ChoicesContentSettings,

  icon: CheckSquare2Icon,
  iconClassName: "bg-green-100",

  recall: [
    {
      label: "answer",
      fn: (page: Choices, value: ChoicesValue) =>
        value
          .map((v) => page.options.find((o) => o.id === v)?.label)
          .join(", "),
    },
  ],

  comparisons: [
    {
      id: "choices_eq",
      type: "choice",
      label: {
        single: "is",
        multiple: "includes",
      },
      getIsMultiple: (page) => page.multiple,
      getOptions: (page) => page.options,
      operator: (value, comparison) =>
        comparison.every((c) => value.includes(c)),
    },
    {
      id: "choices_ne",
      type: "choice",
      label: {
        single: "is not",
        multiple: "does not include",
      },
      getIsMultiple: (page) => page.multiple,
      getOptions: (page) => page.options,
      operator: (value, comparison) =>
        comparison.every((c) => !value.includes(c)),
    },
  ],
};

export default pageDefinition;
