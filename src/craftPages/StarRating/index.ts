import { isNil } from "lodash";
import { StarIcon } from "lucide-react";
import opinionScale from "../OpinionScale";
import { StarRatingContentSettings } from "./ContentSettings";
import { StarRatingEditor } from "./EditorComponent";
import type { StarRating, StarRatingValue } from "./schema";
import { getStarRatingViewerSchema, starRatingEditorSchema } from "./schema";
import { StarRatingViewer } from "./ViewerComponent";

const getOptions = (page: StarRating) =>
  Array.from({ length: page.numStars }, (_, i) => i + 1).map((i) => ({
    id: String(i),
    label: String(i),
  }));

const pageDefinition: PageDefinition.Definition<StarRating, StarRatingValue> = {
  name: "Rating",
  description: "Stars, hearts, thumbs, smileys",

  editorComponent: StarRatingEditor,
  editorSchema: starRatingEditorSchema,
  viewerComponent: StarRatingViewer,
  getViewerSchema: getStarRatingViewerSchema,
  settingsComponent: StarRatingContentSettings,

  icon: StarIcon,
  iconClassName: "bg-orange-100",

  comparisons: opinionScale.comparisons.map((c) => ({
    ...c,
    getOptions,
  })) as unknown as PageDefinition.ComparisonDefinition<
    StarRating,
    StarRatingValue
  >[],

  recall: [
    {
      label: "answer",
      fn: (page: StarRating, value: StarRatingValue) =>
        isNil(value) ? undefined : String(value),
    },
  ],
};

export default pageDefinition;
