import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

export interface CtaButtonViewerProps<T extends FormCraft.CraftPage>
  extends ButtonProps {
  page: T;
  icon?: LucideIcon;
}

export function CtaButtonViewer<T extends FormCraft.CraftPage>(
  props: CtaButtonViewerProps<T>
) {
  const { page, icon: Icon, ...rest } = props;

  return (
    <Button variant="craft" {...rest}>
      {page.cta}
      {Icon && <Icon className="ml-2 size-4" />}
    </Button>
  );
}

export function CtaButtonViewerAsLink<
  T extends FormCraft.CraftPage & {
    ctaLink: string;
  }
>(props: CtaButtonViewerProps<T>) {
  const { page, icon: Icon, ...rest } = props;

  return (
    <Button variant="craft" {...rest} asChild className="no-underline">
      <Link href={page.ctaLink} target="_blank" rel="noopener noreferrer">
        {page.cta}
        {Icon && <Icon className="ml-2 size-4" />}
      </Link>
    </Button>
  );
}
