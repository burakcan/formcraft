import { isNil } from "lodash";
import { StarIcon } from "lucide-react";
import { StarRatingContentSettings } from "./ContentSettings";
import { StarRatingEditor } from "./EditorComponent";
import type { StarRating, StarRatingValue } from "./schema";
import { getStarRatingViewerSchema, starRatingEditorSchema } from "./schema";
import { StarRatingViewer } from "./ViewerComponent";

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

  recall: [
    {
      label: "answer",
      fn: (page: StarRating, value: StarRatingValue) =>
        isNil(value) ? undefined : String(value),
    },
  ],
};

export default pageDefinition;
