import { CalendarDaysIcon } from "lucide-react";
import { DateTextContentSettings } from "./ContentSettings";
import { DateTextEditor } from "./EditorComponent";
import type { DateText, DateTextValue } from "./schema";
import { getDateTextViewerSchema, dateTextEditorSchema } from "./schema";
import { DateTextViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<DateText, DateTextValue> = {
  name: "Date",
  description: "A date input field",

  editorComponent: DateTextEditor,
  editorSchema: dateTextEditorSchema,
  viewerComponent: DateTextViewer,
  getViewerSchema: getDateTextViewerSchema,
  settingsComponent: DateTextContentSettings,

  icon: CalendarDaysIcon,
  iconClassName: "bg-amber-100",

  comparisons: [],

  recall: [
    {
      label: "answer",
      fn: (page: DateText, value: DateTextValue) => {
        const { dateFormat, separator } = page;

        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();

        switch (dateFormat) {
          case "DDMMYYYY":
            return `${day}${separator}${month}${separator}${year}`;
          case "MMDDYYYY":
            return `${month}${separator}${day}${separator}${year}`;
          case "YYYYMMDD":
            return `${year}${separator}${month}${separator}${day}`;
        }
      },
    },
  ],
};

export default pageDefinition;
