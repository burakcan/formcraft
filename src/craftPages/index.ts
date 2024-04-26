import { BookOpen, Megaphone, TextCursorInput } from "lucide-react";
import {
  EndScreenEditor,
  EndScreenViewer,
  endScreenEditorSchema,
  endScreenViewerSchema,
} from "./EndScreen";
import {
  LongTextEditor,
  LongTextViewer,
  longTextEditorSchema,
  longTextViewerSchema,
} from "./LongText";
import {
  ShortTextEditor,
  shortTextViewerSchema,
  shortTextEditorSchema,
} from "./ShortText";
import { ShortTextViewer } from "./ShortText/ViewerComponent";
import {
  StatementEditor,
  StatementViewer,
  statementEditorSchema,
  statementViewerSchema,
} from "./Statement";

export const craftPageDefinitions = {
  statement: {
    name: "Statement",
    description: "A statement or question",

    editorComponent: StatementEditor,
    editorSchema: statementEditorSchema,
    viewerComponent: StatementViewer,
    viewerSchema: statementViewerSchema,

    icon: Megaphone,
    iconClassName: "bg-rose-100",
  },

  end_screen: {
    name: "End Screen",
    description: "The final screen of the form",

    editorComponent: EndScreenEditor,
    editorSchema: endScreenEditorSchema,
    viewerComponent: EndScreenViewer,
    viewerSchema: endScreenViewerSchema,

    icon: BookOpen,
    iconClassName: "bg-emerald-100",
  },

  short_text: {
    name: "Short Text",
    description: "A single line of text",

    editorComponent: ShortTextEditor,
    editorSchema: shortTextEditorSchema,
    viewerComponent: ShortTextViewer,
    viewerSchema: shortTextViewerSchema,

    icon: TextCursorInput,
    iconClassName: "bg-amber-100",
  },

  long_text: {
    name: "Long Text",
    description: "Multi line text input",

    editorComponent: LongTextEditor,
    editorSchema: longTextEditorSchema,
    viewerComponent: LongTextViewer,
    viewerSchema: longTextViewerSchema,

    icon: BookOpen,
    iconClassName: "bg-amber-100",
  },
};
