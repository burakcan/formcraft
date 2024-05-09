import type { LucideIcon } from "lucide-react";
import { CtaButtonEditor } from "../CtaButton";
import { PressEnterEditor } from "../PressEnter";

interface Props<T> {
  page: T;
  onChange: (pageId: string, page: T) => void;
  icon?: LucideIcon;
  withMeta?: boolean;
}

export function CtaSectionEditor<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { page, onChange, icon, withMeta } = props;

  return (
    <div className="w-full p-2 pb-0">
      <CtaButtonEditor page={page} onChange={onChange} icon={icon} />
      <PressEnterEditor withMeta={withMeta} />
    </div>
  );
}
