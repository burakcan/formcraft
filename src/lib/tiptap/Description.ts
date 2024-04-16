import { Paragraph } from "@tiptap/extension-paragraph";

export const Description = Paragraph.extend({
  name: "description",
  group: "description",
  content: "text*",
  parseHTML: () => [{ tag: "p" }],
}).configure({
  HTMLAttributes: {
    class: "text-craft-description font-craft",
  },
});
