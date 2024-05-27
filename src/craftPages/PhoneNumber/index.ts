import { parsePhoneNumber } from "libphonenumber-js";
import { PhoneIcon } from "lucide-react";
import { PhoneNumberContentSettings } from "./ContentSettings";
import { PhoneNumberEditor } from "./EditorComponent";
import type { PhoneNumber, PhoneNumberValue } from "./schema";
import { getPhoneNumberViewerSchema, phoneNumberEditorSchema } from "./schema";
import { PhoneNumberViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Phone number",
  description: "A phone number input field",

  editorComponent: PhoneNumberEditor,
  editorSchema: phoneNumberEditorSchema,
  viewerComponent: PhoneNumberViewer,
  getViewerSchema: getPhoneNumberViewerSchema,
  settingsComponent: PhoneNumberContentSettings,

  icon: PhoneIcon,
  iconClassName: "bg-blue-100",

  recall: [
    {
      label: "answer",
      fn: (page: PhoneNumber, value: PhoneNumberValue) => value,
    },
    {
      label: "country",
      fn: (page: PhoneNumber, value: PhoneNumberValue) => {
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
