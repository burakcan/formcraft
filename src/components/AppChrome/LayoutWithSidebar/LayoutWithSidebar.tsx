import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LayoutWithTopbar } from "..";

interface Props {
  topBar: ReactNode;
  left?: ReactNode;
  leftClassName?: string;
  right?: ReactNode;
  rightClassName?: string;
}

export function LayoutWithSidebar(props: PropsWithChildren<Props>) {
  const { topBar, left, leftClassName, right, rightClassName, children } =
    props;

  return (
    <LayoutWithTopbar topBar={topBar}>
      <div className="flex-1 flex flex-row w-screen">
        {props.left && (
          <aside className={cn("w-56 bg-background border-r", leftClassName)}>
            {left}
          </aside>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {props.right && (
          <aside className={cn("w-56 bg-background border-l", rightClassName)}>
            {right}
          </aside>
        )}
      </div>
    </LayoutWithTopbar>
  );
}
