import { useState, useEffect } from "react";
import { isMacish, isMobile } from "@/lib/utils";

interface Props {
  withMeta?: boolean;
}

export function PressEnterEditor(props: Props) {
  const [isMac, setIsMac] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setIsMac(isMacish());
  }, []);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return null;
  }

  const metaKey = isMac ? "⌘" : "Ctrl";

  return (
    <span className="ml-2 text-sm whitespace-nowrap text-craft-description/50">
      or press{" "}
      {props.withMeta ? (
        <>
          <kbd>{metaKey}</kbd> + <kbd>Enter</kbd>
        </>
      ) : (
        <kbd>Enter</kbd>
      )}
    </span>
  );
}
