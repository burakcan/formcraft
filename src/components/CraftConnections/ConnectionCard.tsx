import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon | IconType;
  iconClassName?: string;
}

export function ConnectionCard(props: PropsWithChildren<Props>) {
  const { children, title, description, iconClassName } = props;
  return (
    <div className="bg-background shadow-sm rounded p-4">
      <div className="flex items-start gap-4 w-full">
        <props.icon className={cn("size-6 mt-1", iconClassName)} />
        <div className="flex-1">
          <h2 className="text-lg font-md">{title}</h2>
          <p className="text-sm">{description}</p>
          <div className="pt-4 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
