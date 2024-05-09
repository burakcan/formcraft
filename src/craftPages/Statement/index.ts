import { Megaphone } from "lucide-react";
import { StatementContentSettings } from "./ContentSettings";
import { StatementEditor } from "./EditorComponent";
import { getStatementViewerSchema, statementEditorSchema } from "./schema";
import { StatementViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Statement",
  description: "A statement or question",

  editorComponent: StatementEditor,
  editorSchema: statementEditorSchema,
  viewerComponent: StatementViewer,
  getViewerSchema: getStatementViewerSchema,
  settingsComponent: StatementContentSettings,

  icon: Megaphone,
  iconClassName: "bg-rose-100",
};

export default pageDefinition;
