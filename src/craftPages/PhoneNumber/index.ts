import { parsePhoneNumber } from "libphonenumber-js";
import { PhoneIcon } from "lucide-react";
import { PhoneNumberContentSettings } from "./ContentSettings";
import { PhoneNumberEditor } from "./EditorComponent";
import type { PhoneNumber, PhoneNumberValue } from "./schema";
import { getPhoneNumberViewerSchema, phoneNumberEditorSchema } from "./schema";
import { PhoneNumberViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<PhoneNumber, PhoneNumberValue> =
  {
    name: "Phone number",
    description: "A phone number input field",

    editorComponent: PhoneNumberEditor,
    editorSchema: phoneNumberEditorSchema,
    viewerComponent: PhoneNumberViewer,
    getViewerSchema: getPhoneNumberViewerSchema,
    settingsComponent: PhoneNumberContentSettings,

    icon: PhoneIcon,
    iconClassName: "bg-blue-100",

    comparisons: [],

    recall: [
      {
        label: "answer",
        fn: (page, value) => value,
      },
      {
        label: "country",
        fn: (page, value) => {
          try {
            return parsePhoneNumber(value).country;
          } catch (e) {
            return "";
          }
        },
      },
    ],
  };

export default pageDefinition;
