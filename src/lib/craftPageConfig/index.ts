import { BookOpen, Megaphone, TextCursorInput } from "lucide-react";
import { endScreen } from "./endScreen";
import { longText } from "./longText";
import { shortText } from "./shortText";
import { statement } from "./statement";
import { EndScreenRenderer } from "@/components/CraftBuilder/PageRenderer/EndScreen";
import { LongTextRenderer } from "@/components/CraftBuilder/PageRenderer/LongText";
import { ShortTextRenderer } from "@/components/CraftBuilder/PageRenderer/ShortText";
import { StatementRenderer } from "@/components/CraftBuilder/PageRenderer/Statement";

export const pageDefinitions = {
  statement: {
    name: "Statement",
    description: "A statement or question",
    component: StatementRenderer,
    schema: statement,
    icon: Megaphone,
  },
  short_text: {
    name: "Short Text",
    description: "A single line of text",
    component: ShortTextRenderer,
    schema: shortText,
    icon: TextCursorInput,
  },
  long_text: {
    name: "Long Text",
    description: "Multi line text input",
    component: LongTextRenderer,
    schema: longText,
    icon: BookOpen,
  },
  end_screen: {
    name: "End Screen",
    description: "The final screen of the form",
    component: EndScreenRenderer,
    schema: endScreen,
  },
};
