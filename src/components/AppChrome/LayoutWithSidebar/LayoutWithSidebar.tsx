import type { PropsWithChildren, ReactNode } from "react";
import { LayoutWithTopbar } from "..";

interface Props {
  topBar: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

export function LayoutWithSidebar(props: PropsWithChildren<Props>) {
  return (
    <LayoutWithTopbar topBar={props.topBar}>
      <div className="flex-1 flex flex-row w-screen">
        {props.left && (
          <aside className="w-56 bg-background border-r">{props.left}</aside>
        )}
        <div className="flex-1 overflow-y-auto">{props.children}</div>
        {props.right && (
          <aside className="w-56 bg-background border-l">{props.right}</aside>
        )}
      </div>
    </LayoutWithTopbar>
  );
}
