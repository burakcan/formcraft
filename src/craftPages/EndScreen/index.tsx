import { PartyPopperIcon } from "lucide-react";
import { EndScreenContentSettings } from "./ContentSettings";
import { EndScreenEditor } from "./EditorComponent";
import type { EndScreen } from "./schema";
import { endScreenEditorSchema, getEndScreenViewerSchema } from "./schema";
import { EndScreenViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<EndScreen, null> = {
  name: "End Screen",
  description: "The final screen of the form",

  editorComponent: EndScreenEditor,
  editorSchema: endScreenEditorSchema,
  viewerComponent: EndScreenViewer,
  getViewerSchema: getEndScreenViewerSchema,
  settingsComponent: EndScreenContentSettings,

  icon: PartyPopperIcon,
  iconClassName: "bg-stone-200",

  recall: [],
  comparisons: [],
};

export default pageDefinition;
