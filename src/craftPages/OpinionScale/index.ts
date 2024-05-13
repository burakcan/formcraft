import { BarChartIcon } from "lucide-react";
import { OpinionScaleContentSettings } from "./ContentSettings";
import { OpinionScaleEditor } from "./EditorComponent";
import {
  getOpinionScaleViewerSchema,
  opinionScaleEditorSchema,
} from "./schema";
import { OpinionScaleViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Opinion scale",
  description: "Collect opinions with a scale",

  editorComponent: OpinionScaleEditor,
  editorSchema: opinionScaleEditorSchema,
  viewerComponent: OpinionScaleViewer,
  getViewerSchema: getOpinionScaleViewerSchema,
  settingsComponent: OpinionScaleContentSettings,

  icon: BarChartIcon,
  iconClassName: "bg-orange-100",
};

export default pageDefinition;
