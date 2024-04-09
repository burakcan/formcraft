import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function TopBar(props: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        "h-full w-full bg-background border-b flex",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
