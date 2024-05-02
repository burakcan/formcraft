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

  return (
    <div className="w-full pt-2">
      <CtaButtonViewer {...rest} type="submit" />
      <PressEnterViewer withMeta={withMeta} />
    </div>
  );
}
