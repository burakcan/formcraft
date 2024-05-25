import { Document } from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import { Description } from "./Description";
import { Title } from "./Title";

export const DocumentWithTitleDescription = Document.extend({
  content: "title description",
  addKeyboardShortcuts() {
    return {
      "Cmd+Z": (props) => {
        console.log("Mod+Z", props);
        return true;
      },
      "Mod+Shift+Z": () => true,
    };
  },
});

export const DocumentWithTitleDescriptionKit = [
  DocumentWithTitleDescription,
  Title,
  Description,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "title") {
        return "Title";
      }

      if (node.type.name === "description") {
        return "Description...";
      }

      return "Write something...";
    },
    showOnlyCurrent: false,
  }),
  Text,
];
