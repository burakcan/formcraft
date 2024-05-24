import { useEffect, useState } from "react";

export function useHasScroll(
  refToMeasure: React.RefObject<HTMLElement>,
  deps: any[] = [],
  refToObserve: React.RefObject<HTMLElement> = refToMeasure
) {
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!refToMeasure.current) {
        return;
      }

      const hasScroll =
        (refToMeasure.current?.scrollHeight || 0) >
        (refToMeasure.current?.clientHeight || 0);

      setHasScroll(hasScroll);
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (refToObserve.current) {
      resizeObserver.observe(refToObserve.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return hasScroll;
}
