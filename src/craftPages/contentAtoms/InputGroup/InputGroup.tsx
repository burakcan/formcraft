import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function InputGroup(props: PropsWithChildren<Props>) {
  const { children, className } = props;
  return (
    <div
      className={cn(
        "p-4 border-b last-of-type:border-none flex flex-col gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
