import { CalendarDaysIcon } from "lucide-react";
import { DateTextContentSettings } from "./ContentSettings";
import { DateTextEditor } from "./EditorComponent";
import { getDateTextViewerSchema, dateTextEditorSchema } from "./schema";
import { DateTextViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Date",
  description: "A date input field",

  editorComponent: DateTextEditor,
  editorSchema: dateTextEditorSchema,
  viewerComponent: DateTextViewer,
  getViewerSchema: getDateTextViewerSchema,
  settingsComponent: DateTextContentSettings,

  icon: CalendarDaysIcon,
  iconClassName: "bg-amber-100",
};

export default pageDefinition;
