import { Document } from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import { Description } from "./Description";
import { Title } from "./Title";

export const DocumentWithTitleDescription = Document.extend({
  content: "title description",
  addKeyboardShortcuts() {
    return {
      "Mod-Z": () => {
        return true;
      },
      "Mod-Shift-Z": () => {
        return true;
      },
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
        return "Description... Recall previous answers with @.";
      }

      return "Write something...";
    },
    showOnlyCurrent: false,
  }),
  Text,
];
