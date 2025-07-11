import { AtSignIcon } from "lucide-react";
import shortText from "../ShortText";
import { EmailContentSettings } from "./ContentSettings";
import { EmailEditor } from "./EditorComponent";
import type { Email, EmailValue } from "./schema";
import { getEmailViewerSchema, emailEditorSchema } from "./schema";
import { EmailViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<Email, EmailValue> = {
  name: "Email address",
  description: "Ask for an email address",

  editorComponent: EmailEditor,
  editorSchema: emailEditorSchema,
  viewerComponent: EmailViewer,
  getViewerSchema: getEmailViewerSchema,
  settingsComponent: EmailContentSettings,

  icon: AtSignIcon,
  iconClassName: "bg-blue-100",

  comparisons:
    shortText.comparisons as unknown as PageDefinition.ComparisonDefinition<
      Email,
      EmailValue
    >[],

  recall: [
    {
      label: "answer",
      fn: (page: Email, value: EmailValue) => value,
    },
  ],
};

export default pageDefinition;
