import { Link2Icon } from "lucide-react";
import { WebsiteContentSettings } from "./ContentSettings";
import { WebsiteEditor } from "./EditorComponent";
import { getWebsiteViewerSchema, websiteEditorSchema } from "./schema";
import { WebsiteViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Website",
  description: "Ask for a website URL",

  editorComponent: WebsiteEditor,
  editorSchema: websiteEditorSchema,
  viewerComponent: WebsiteViewer,
  getViewerSchema: getWebsiteViewerSchema,
  settingsComponent: WebsiteContentSettings,

  icon: Link2Icon,
  iconClassName: "bg-amber-100",
};

export default pageDefinition;
