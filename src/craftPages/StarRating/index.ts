import { StarIcon } from "lucide-react";
import { StarRatingContentSettings } from "./ContentSettings";
import { StarRatingEditor } from "./EditorComponent";
import { getStarRatingViewerSchema, starRatingEditorSchema } from "./schema";
import { StarRatingViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Rating",
  description: "Stars, hearts, thumbs, smileys",

  editorComponent: StarRatingEditor,
  editorSchema: starRatingEditorSchema,
  viewerComponent: StarRatingViewer,
  getViewerSchema: getStarRatingViewerSchema,
  settingsComponent: StarRatingContentSettings,

  icon: StarIcon,
  iconClassName: "bg-orange-100",
};

export default pageDefinition;
