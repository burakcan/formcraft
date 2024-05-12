"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { useViewCraftStoreTemporal } from "@/hooks/useViewCraftStore";

interface Props {
  form?: string;
}

export function PageNavigationViewer(props: Props) {
  const { form } = props;
  const { setReason: setPageChangeReson } = usePageChangeReason();
  const { undo, canPrev } = useViewCraftStoreTemporal((s) => ({
    undo: s.undo,
    canPrev: s.pastStates.length > 0,
  }));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handlePrev = () => {
    setPageChangeReson("prev");
    requestAnimationFrame(() => undo());
  };

  const handleNext = () => {
    const formEl = document.querySelector<HTMLFormElement>(`#${form}`);

    if (formEl) {
      formEl.requestSubmit();
    }
  };

  return (
    <>
      {"document" in global &&
        isMounted &&
        createPortal(
          <div className="absolute right-2 bottom-8 z-20">
            <Button
              className="size-8 p-0 rounded-r-none"
              onClick={() => handlePrev()}
              disabled={!canPrev}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              className="size-8 p-0 rounded-l-none ml-[1px]"
              onClick={handleNext}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>,
          document.body
        )}
    </>
  );
}
