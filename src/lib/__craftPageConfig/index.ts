import { BookOpen, Megaphone, TextCursorInput } from "lucide-react";
import { endScreen } from "./endScreen";
import { longText } from "./longText";
import { shortText } from "./shortText";
import { statement } from "./statement";
import { EndScreenRenderer } from "@/components/CraftBuilder/PageComponents/EndScreen";
import { LongTextRenderer } from "@/components/CraftBuilder/PageComponents/LongText";
import { ShortTextRenderer } from "@/components/CraftBuilder/PageComponents/ShortText";
import { StatementRenderer } from "@/components/CraftBuilder/PageComponents/Statement";
import { StatementViewer } from "@/components/CraftViewer/PageComponents/Statement";

export type { LongText } from "./longText";
export type { ShortText } from "./shortText";
export type { Statement } from "./statement";
export type { EndScreen } from "./endScreen";

export const pageDefinitions = {
  statement: {
    name: "Statement",
    description: "A statement or question",
    component: StatementRenderer,
    viewerComponent: StatementViewer,
    schema: statement,
    icon: Megaphone,
    iconClassName: "bg-rose-100",
    output: () => {
      return {
        type: "literal",
        value: true,
      };
    },
  },
  short_text: {
    name: "Short Text",
    description: "A single line of text",
    component: ShortTextRenderer,
    schema: shortText,
    icon: TextCursorInput,
    iconClassName: "bg-amber-100",
    output: () => {
      return {
        type: "string",
      };
    },
  },
  long_text: {
    name: "Long Text",
    description: "Multi line text input",
    component: LongTextRenderer,
    schema: longText,
    icon: BookOpen,
    iconClassName: "bg-amber-100",
    output: () => {
      return {
        type: "string",
      };
    },
  },
  end_screen: {
    name: "End Screen",
    description: "The final screen of the form",
    component: EndScreenRenderer,
    schema: endScreen,
    icon: BookOpen,
    iconClassName: "bg-emerald-100",
    output: () => {
      return {
        type: "none",
      };
    },
  },
};
