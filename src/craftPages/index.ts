import { BookOpen, HashIcon, Megaphone, TextCursorInput } from "lucide-react";
import {
  EndScreenEditor,
  EndScreenViewer,
  endScreenEditorSchema,
  getEndScreenViewerSchema,
} from "./EndScreen";
import {
  LongTextEditor,
  LongTextViewer,
  longTextEditorSchema,
  getLongTextViewerSchema,
} from "./LongText";
import {
  NumberInputEditor,
  NumberInputViewer,
  getNumberInputViewerSchema,
  numberInputEditorSchema,
} from "./NumberInput";
import {
  ShortTextEditor,
  getShortTextViewerSchema,
  shortTextEditorSchema,
} from "./ShortText";
import { ShortTextViewer } from "./ShortText/ViewerComponent";
import {
  StatementEditor,
  StatementViewer,
  statementEditorSchema,
  getStatementViewerSchema,
} from "./Statement";

export const craftPageDefinitions = {
  statement: {
    name: "Statement",
    description: "A statement or question",

    editorComponent: StatementEditor,
    editorSchema: statementEditorSchema,
    viewerComponent: StatementViewer,
    getViewerSchema: getStatementViewerSchema,

    icon: Megaphone,
    iconClassName: "bg-rose-100",
  },

  end_screen: {
    name: "End Screen",
    description: "The final screen of the form",

    editorComponent: EndScreenEditor,
    editorSchema: endScreenEditorSchema,
    viewerComponent: EndScreenViewer,
    getViewerSchema: getEndScreenViewerSchema,

    icon: BookOpen,
    iconClassName: "bg-emerald-100",
  },

  short_text: {
    name: "Short Text",
    description: "A single line of text",

    editorComponent: ShortTextEditor,
    editorSchema: shortTextEditorSchema,
    viewerComponent: ShortTextViewer,
    getViewerSchema: getShortTextViewerSchema,

    icon: TextCursorInput,
    iconClassName: "bg-amber-100",
  },

  number_input: {
    name: "Number",
    description: "A number input",

    editorComponent: NumberInputEditor,
    editorSchema: numberInputEditorSchema,
    viewerComponent: NumberInputViewer,
    getViewerSchema: getNumberInputViewerSchema,

    icon: HashIcon,
    iconClassName: "bg-amber-100",
  },

  long_text: {
    name: "Long Text",
    description: "Multi line text input",

    editorComponent: LongTextEditor,
    editorSchema: longTextEditorSchema,
    viewerComponent: LongTextViewer,
    getViewerSchema: getLongTextViewerSchema,

    icon: BookOpen,
    iconClassName: "bg-amber-100",
  },
};
