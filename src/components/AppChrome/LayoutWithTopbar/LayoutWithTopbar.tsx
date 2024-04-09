import type { PropsWithChildren, ReactNode } from "react";

interface Props {
  topBar: ReactNode;
}

export function LayoutWithTopbar(props: PropsWithChildren<Props>) {
  return (
    <main className="flex h-screen flex-col">
      <header className="w-full h-16 flex-none sticky top-0 left-0">
        {props.topBar}
      </header>
      <div className="flex-1 flex flex-row max-h-[calc(100%-64px)]">
        {props.children}
      </div>
    </main>
  );
}
