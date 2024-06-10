import { Link2Icon } from "lucide-react";
import { WebsiteContentSettings } from "./ContentSettings";
import { WebsiteEditor } from "./EditorComponent";
import type { Website, WebsiteValue } from "./schema";
import { getWebsiteViewerSchema, websiteEditorSchema } from "./schema";
import { WebsiteViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<Website, WebsiteValue> = {
  name: "Website",
  description: "Ask for a website URL",

  editorComponent: WebsiteEditor,
  editorSchema: websiteEditorSchema,
  viewerComponent: WebsiteViewer,
  getViewerSchema: getWebsiteViewerSchema,
  settingsComponent: WebsiteContentSettings,

  icon: Link2Icon,
  iconClassName: "bg-blue-100",

  comparisons: [],

  recall: [
    {
      label: "answer",
      fn: (page: Website, value: WebsiteValue) => value,
    },
  ],
};

export default pageDefinition;
