import { PhoneIcon } from "lucide-react";
import { PhoneNumberContentSettings } from "./ContentSettings";
import { PhoneNumberEditor } from "./EditorComponent";
import { getPhoneNumberViewerSchema, phoneNumberEditorSchema } from "./schema";
import { PhoneNumberViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Phone number",
  description: "A phone number input field.",

  editorComponent: PhoneNumberEditor,
  editorSchema: phoneNumberEditorSchema,
  viewerComponent: PhoneNumberViewer,
  getViewerSchema: getPhoneNumberViewerSchema,
  settingsComponent: PhoneNumberContentSettings,

  icon: PhoneIcon,
  iconClassName: "bg-amber-100",
};

export default pageDefinition;
