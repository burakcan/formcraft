import type { PropsWithChildren } from "react";

interface Props {}

export function Sidebar(props: PropsWithChildren<Props>) {
  return <div className="w-full h-full">{props.children}</div>;
}
