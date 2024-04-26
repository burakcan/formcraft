import { useRef, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface Props {
  innerWrapperClassName?: string;
}

export function PageWrapperEditor(props: PropsWithChildren<Props>) {
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
      <div className={cn("w-full", props.innerWrapperClassName)}>
        {props.children}
      </div>
    </div>
  );
}
