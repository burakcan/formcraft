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

const getOptions = (page: OpinionScale) =>
  Array.from({ length: page.max }, (_, i) => i + 1).map((i) => ({
    id: String(i),
    label: String(i),
  }));

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

  comparisons: [
    {
      type: "choice",
      id: "opinion_eq",
      label: {
        single: "is",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value === Number(comparison[0]),
    },
    {
      type: "choice",
      id: "opinion_ne",
      label: {
        single: "is not",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value !== Number(comparison[0]),
    },
    {
      type: "choice",
      id: "opinion_gt",
      label: {
        single: "is greater than",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value > Number(comparison[0]),
    },
    {
      type: "choice",
      id: "opinion_gte",
      label: {
        single: "is greater than or equal to",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value >= Number(comparison[0]),
    },
    {
      type: "choice",
      id: "opinion_lt",
      label: {
        single: "is less than",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value < Number(comparison[0]),
    },
    {
      type: "choice",
      id: "opinion_lte",
      label: {
        single: "is less than or equal to",
        multiple: "",
      },
      getIsMultiple: () => false,
      getOptions,
      operator: (value, comparison) => value <= Number(comparison[0]),
    },
  ],

  recall: [
    {
      label: "answer",
      fn: (page: OpinionScale, value: OpinionScaleValue) =>
        isNil(value) ? undefined : String(value),
    },
  ],
};

export default pageDefinition;
