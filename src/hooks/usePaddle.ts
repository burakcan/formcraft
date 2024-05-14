import { useAuth } from "@clerk/nextjs";
import type { Paddle } from "@paddle/paddle-js";
import { initializePaddle } from "@paddle/paddle-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { setSubscriptionEnabled } from "./useSubscriptionQuery";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();
  const queryClient = useQueryClient();
  const auth = useAuth();

  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as
        | "sandbox"
        | "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_TOKEN as string,
      eventCallback: (data) => {
        if (!auth.userId) {
          return;
        }

        if (data.name === "checkout.completed") {
          setSubscriptionEnabled(
            queryClient,
            auth.userId,
            auth.orgId || undefined
          );
        }
      },
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, [auth.orgId, auth.userId, queryClient]);

  return paddle;
}
