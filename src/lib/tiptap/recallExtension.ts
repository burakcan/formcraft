import Mention from "@tiptap/extension-mention";
import { ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import type { SuggestionProps } from "@tiptap/suggestion";
import type {
  Instance as TippyInstance,
  GetReferenceClientRect as TippyGetReferenceClientRect,
} from "tippy.js";
import tippy from "tippy.js";
import { RecallList } from "@/components/RecallList";
import { RecallTokenNode } from "@/components/RecallToken";

export const recallExtension = Mention.extend({
  name: "recall",
  addAttributes() {
    return {
      label: {
        default: null,
        parseHTML: (element) => ({
          label: element.getAttribute("data-label"),
        }),
        renderHTML: (attributes) => {
          if (!attributes.label) return {};
          return {
            "data-label": attributes.label,
          };
        },
      },
      pageId: {
        default: null,
        parseHTML: (element) => ({
          pageId: element.getAttribute("data-page-id"),
        }),
        renderHTML: (attributes) => {
          if (!attributes.pageId) return {};
          return {
            "data-page-id": attributes.pageId,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(RecallTokenNode);
  },
}).configure({
  HTMLAttributes: {
    class: "recall",
  },
  deleteTriggerWithBackspace: true,
  suggestion: {
    render: () => {
      let component: ReactRenderer<HTMLDivElement, SuggestionProps>;
      let popup: TippyInstance[];

      return {
        onStart: (props) => {
          component = new ReactRenderer<HTMLDivElement, SuggestionProps>(
            RecallList,
            {
              props,
              editor: props.editor,
            }
          );

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect:
              props.clientRect as TippyGetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect:
              props.clientRect as TippyGetReferenceClientRect,
          });
        },
        onExit: () => {
          popup[0]?.destroy();
          component?.destroy();
        },
        onKeyDown: (props) => {
          // up key
          if (props.event.key === "ArrowUp") {
            props.event.preventDefault();
            props.event.stopImmediatePropagation();

            // @ts-ignore
            component.ref!.arrowUp();
            return false;
          }

          // down key
          if (props.event.key === "ArrowDown") {
            props.event.preventDefault();
            props.event.stopImmediatePropagation();

            // @ts-ignore
            component.ref!.arrowDown();
            return false;
          }

          // enter key
          if (props.event.key === "Enter") {
            // @ts-ignore
            component.ref!.enter();
            return true;
          }

          if (props.event.key === "Escape") {
            popup[0]?.hide();

            return true;
          }

          return false;
        },
      };
    },
  },
});
