import { useRef, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function PageWrapper(props: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  const hasScroll =
    (ref.current?.scrollHeight || 0) > (ref.current?.clientHeight || 0);

  return (
    <div
      className={cn(
        "size-full flex flex-col items-center p-16 break-before-all overflow-y-auto",
        { "justify-center": !hasScroll }
      )}
      ref={ref}
    >
      {props.children}
    </div>
  );
}
