import { useRef, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { useHasScroll } from "@/hooks/useHasScroll";

interface Props {
  innerWrapperClassName?: string;
}

export function PageWrapperEditor(props: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null);
  const hasScroll = useHasScroll(ref, [props.children]);

  return (
    <div
      className={cn(
        "size-full flex flex-col items-center p-16 break-before-all overflow-y-auto",
        { "justify-center": !hasScroll }
      )}
      ref={ref}
    >
      <div
        className={cn(
          "max-w-screen-md w-full mx-auto",
          props.innerWrapperClassName
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
