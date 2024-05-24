import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConnectStripeMutation } from "@/hooks/useConnectStripeMutation";

interface Props {
  refetchStripeAccount: () => void;
}

export function ConnectButton(props: Props) {
  const { refetchStripeAccount } = props;
  const mutation = useConnectStripeMutation();
  const [stripeWindowOpen, setStripeWindowOpen] = useState(false);

  const handleConnectClick = async () => {
    try {
      const response = await mutation.mutateAsync();
      const newWindow = window.open(response.url, "_blank");

      if (newWindow) {
        setStripeWindowOpen(true);

        const interval = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(interval);
            refetchStripeAccount();
            setStripeWindowOpen(false);
          }
        }, 1000);
      } else {
        throw new Error("Failed to open Stripe connect window");
      }
    } catch (error) {
      toast.error("There was an error connecting to Stripe. Please try again.");
    }
  };

  return (
    <Button onClick={handleConnectClick}>
      {mutation.isPending || stripeWindowOpen ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        "Connect to Stripe"
      )}
    </Button>
  );
}
