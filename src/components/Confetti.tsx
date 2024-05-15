"use client";

import { useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Confetti() {
  const params = useSearchParams();

  useLayoutEffect(() => {
    if (params.get("success") === "true" && params.get("session_id")) {
      import("@tsparticles/confetti").then(({ confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    }
  }, [params]);

  return null;
}
