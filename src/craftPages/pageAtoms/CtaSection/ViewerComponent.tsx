import hotkeys from "hotkeys-js";
import { useEffect } from "react";
import type { CtaButtonViewerProps } from "../CtaButton";
import { CtaButtonViewer } from "../CtaButton";
import { PressEnterViewer } from "../PressEnter/ViewerComponent";

interface Props<T extends FormCraft.CraftPage> extends CtaButtonViewerProps<T> {
  withMeta?: boolean;
}

export function CtaSectionViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { withMeta, ...rest } = props;
  const { page, form } = rest;

  useEffect(() => {
    hotkeys.setScope(page.id);

    hotkeys.filter = (event) => {
      const tagName = (event.target as HTMLElement).tagName;
      const isTextArea = tagName === "TEXTAREA";
      const metaEnter =
        event.key === "Enter" && (event.metaKey || event.ctrlKey);

      if (isTextArea && !metaEnter) {
        return false;
      }

      return true;
    };

    hotkeys("enter,cmd+enter,ctrl+enter", page.id, (event) => {
      event.preventDefault();
      const formEl = document.querySelector<HTMLFormElement>(`#${form}`);

      if (formEl) {
        formEl.requestSubmit();
      }
    });

    return () => {
      hotkeys.deleteScope(page.id);
    };
  }, [form, page.id]);

  return (
    <div className="w-full pt-2">
      <CtaButtonViewer {...rest} type="submit" />
      <PressEnterViewer withMeta={withMeta} />
    </div>
  );
}
