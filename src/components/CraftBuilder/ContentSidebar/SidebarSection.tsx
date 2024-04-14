import { ScrollArea } from "@radix-ui/react-scroll-area";
import type { PropsWithChildren, ReactNode } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

interface Props extends PropsWithChildren {
  title: ReactNode;
  minSize?: number;
  defaultSize?: number;
}

export function SidebarSection(props: Props) {
  const { minSize, defaultSize, title, children } = props;
  return (
    <ResizablePanel
      className="flex flex-col"
      minSize={minSize}
      defaultSize={defaultSize}
    >
      <div className="flex-none flex items-center justify-between py-2 mx-2 text-sm font-medium border-b">
        {title}
      </div>
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </ResizablePanel>
  );
}
