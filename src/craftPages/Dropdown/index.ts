import { ListTreeIcon } from "lucide-react";
import { DropdownContentSettings } from "./ContentSettings";
import { DropdownEditor } from "./EditorComponent";
import type { Dropdown, DropdownValue } from "./schema";
import { dropdownEditorSchema, getDropdownViewerSchema } from "./schema";
import { DropdownViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<Dropdown, DropdownValue> = {
  name: "Dropdown",
  description: "Select from a dropdown list",

  editorComponent: DropdownEditor,
  editorSchema: dropdownEditorSchema,
  viewerComponent: DropdownViewer,
  getViewerSchema: getDropdownViewerSchema,
  settingsComponent: DropdownContentSettings,

  icon: ListTreeIcon,
  iconClassName: "bg-purple-100",

  recall: [
    {
      label: "answer",
      fn: (page: Dropdown, value: DropdownValue) =>
        page.options.find((o) => o.id === value[0])?.label,
    },
  ],

  comparisons: [
    {
      id: "dropdown_eq",
      type: "choice",
      label: {
        single: "is",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions: (page) => page.options,
      operator: (value, comparison) => value[0] === comparison[0],
    },
    {
      id: "dropdown_ne",
      type: "choice",
      label: {
        single: "is not",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions: (page) => page.options,
      operator: (value, comparison) => value[0] !== comparison[0],
    },
  ],
};

export default pageDefinition;