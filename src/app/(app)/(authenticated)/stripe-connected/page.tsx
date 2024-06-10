import { FaStripeS } from "react-icons/fa";
import Confetti from "@/components/Confetti";

export default async function StripeConnected() {
  return (
    <div className="fixed top-0 left-0 size-full flex items-center justify-center bg-accent">
      <Confetti />
      <div className="p-4 bg-background rounded shadow-md">
        <FaStripeS className="bg-indigo-500" size={48} />
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
