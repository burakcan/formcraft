import { Megaphone } from "lucide-react";
import { StatementContentSettings } from "./ContentSettings";
import { StatementEditor } from "./EditorComponent";
import type { Statement } from "./schema";
import { getStatementViewerSchema, statementEditorSchema } from "./schema";
import { StatementViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<Statement, true> = {
  name: "Statement",
  description: "A statement or question",

  editorComponent: StatementEditor,
  editorSchema: statementEditorSchema,
  viewerComponent: StatementViewer,
  getViewerSchema: getStatementViewerSchema,
  settingsComponent: StatementContentSettings,

  icon: Megaphone,
  iconClassName: "bg-rose-100",

  recall: [],
};

export default pageDefinition;
