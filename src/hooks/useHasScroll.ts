import { useEffect, useState } from "react";

export function useHasScroll(
  ref: React.RefObject<HTMLElement>,
  deps: any[] = []
) {
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!ref.current) {
        return;
      }

      const hasScroll =
        (ref.current?.scrollHeight || 0) > (ref.current?.clientHeight || 0);

      setHasScroll(hasScroll);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return hasScroll;
}
