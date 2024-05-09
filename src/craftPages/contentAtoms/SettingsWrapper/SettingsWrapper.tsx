import type { PropsWithChildren } from "react";

export function SettingsWrapper(props: PropsWithChildren) {
  return <div className="pb-4 flex flex-col">{props.children}</div>;
}
