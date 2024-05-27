import { isNil } from "lodash";
import { BarChartIcon } from "lucide-react";
import { OpinionScaleContentSettings } from "./ContentSettings";
import { OpinionScaleEditor } from "./EditorComponent";
import type { OpinionScale, OpinionScaleValue } from "./schema";
import {
  getOpinionScaleViewerSchema,
  opinionScaleEditorSchema,
} from "./schema";
import { OpinionScaleViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<
  OpinionScale,
  OpinionScaleValue
> = {
  name: "Opinion scale",
  description: "Collect opinions with a scale",

  editorComponent: OpinionScaleEditor,
  editorSchema: opinionScaleEditorSchema,
  viewerComponent: OpinionScaleViewer,
  getViewerSchema: getOpinionScaleViewerSchema,
  settingsComponent: OpinionScaleContentSettings,

  icon: BarChartIcon,
  iconClassName: "bg-orange-100",

  recall: [
    {
      label: "answer",
      fn: (page: OpinionScale, value: OpinionScaleValue) =>
        isNil(value) ? undefined : String(value),
    },
  ],
};

export default pageDefinition;
