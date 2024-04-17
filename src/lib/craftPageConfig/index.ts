import { BookOpen, Megaphone, TextCursorInput } from "lucide-react";
import { endScreen } from "./endScreen";
import { longText } from "./longText";
import { shortText } from "./shortText";
import { statement } from "./statement";
import { EndScreenRenderer } from "@/components/CraftBuilder/PageRenderer/EndScreen";
import { LongTextRenderer } from "@/components/CraftBuilder/PageRenderer/LongText";
import { ShortTextRenderer } from "@/components/CraftBuilder/PageRenderer/ShortText";
import { StatementRenderer } from "@/components/CraftBuilder/PageRenderer/Statement";

export type { LongText } from "./longText";
export type { ShortText } from "./shortText";
export type { Statement } from "./statement";
export type { EndScreen } from "./endScreen";

export const pageDefinitions = {
  statement: {
    name: "Statement",
    description: "A statement or question",
    component: StatementRenderer,
    schema: statement,
    icon: Megaphone,
    iconClassName: "bg-rose-100",
  },
  short_text: {
    name: "Short Text",
    description: "A single line of text",
    component: ShortTextRenderer,
    schema: shortText,
    icon: TextCursorInput,
    iconClassName: "bg-amber-100",
  },
  long_text: {
    name: "Long Text",
    description: "Multi line text input",
    component: LongTextRenderer,
    schema: longText,
    icon: BookOpen,
    iconClassName: "bg-amber-100",
  },
  end_screen: {
    name: "End Screen",
    description: "The final screen of the form",
    component: EndScreenRenderer,
    schema: endScreen,
    icon: BookOpen,
    iconClassName: "bg-emerald-100",
  },
};
