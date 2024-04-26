import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props<T extends FormCraft.CraftPage> {
  page: T;
  icon?: LucideIcon;
}

export function CtaButtonViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { page } = props;

  return (
    <Button>
      {page.cta}
      {props.icon && <props.icon className="ml-2 size-4" />}
    </Button>
  );
}
