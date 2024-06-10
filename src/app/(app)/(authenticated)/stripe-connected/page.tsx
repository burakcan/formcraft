"use client";

import { useLayoutEffect } from "react";
import { FaStripe } from "react-icons/fa";

export default function StripeConnected() {
  useLayoutEffect(() => {
    import("@tsparticles/confetti").then(({ confetti }) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        shapes: ["emoji"],
        shapeOptions: {
          emoji: {
            value: ["💵", "💶", "💷", "🎉"],
          },
        },
      });
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 size-full flex items-center justify-center bg-accent">
      <div className="p-4 bg-background rounded shadow-md">
        <FaStripe
          className="bg-indigo-500 text-white p-2 rounded mb-2"
          size={48}
        />
        <h1 className="text-2xl font-bold">Success!</h1>
        <p className="mt-2">
          Your Stripe account has been successfully connected.
          <br />
          You can now close this window.
        </p>
      </div>
    </div>
  );
}
