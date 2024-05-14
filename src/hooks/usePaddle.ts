import type { Paddle } from "@paddle/paddle-js";
import { initializePaddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as
        | "sandbox"
        | "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_TOKEN as string,
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  return paddle;
}
