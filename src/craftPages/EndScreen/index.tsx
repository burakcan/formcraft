import { PartyPopperIcon } from "lucide-react";
import { EndScreenContentSettings } from "./ContentSettings";
import { EndScreenEditor } from "./EditorComponent";
import { endScreenEditorSchema, getEndScreenViewerSchema } from "./schema";
import { EndScreenViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "End Screen",
  description: "The final screen of the form",

  editorComponent: EndScreenEditor,
  editorSchema: endScreenEditorSchema,
  viewerComponent: EndScreenViewer,
  getViewerSchema: getEndScreenViewerSchema,
  settingsComponent: EndScreenContentSettings,

  icon: PartyPopperIcon,
  iconClassName: "bg-stone-200",
};

export default pageDefinition;
