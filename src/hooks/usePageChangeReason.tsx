import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export const PageChangeReasonContext = createContext<{
  reason: "answer" | "prev" | "init";
  setReason: (reason: "answer" | "prev" | "init") => void;
}>({
  reason: "init",
  setReason: () => {},
});

export function PageChangeReasonProvider(props: PropsWithChildren) {
  const { children } = props;
  const [reason, setReason] = useState<"answer" | "prev" | "init">("init");

  return (
    <PageChangeReasonContext.Provider
      value={{
        reason,
        setReason,
      }}
    >
      {children}
    </PageChangeReasonContext.Provider>
  );
}

export function usePageChangeReason() {
  return useContext(PageChangeReasonContext);
}
