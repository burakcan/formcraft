"use client";
import {
  CheckCircle2,
  CircleXIcon,
  LoaderCircle,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ConnectionCard } from "./ConnectionCard";
import { useCraftConnectionsMutation } from "@/hooks/useCraftConnectionsMutation";
import { useCraftConnectionsQuery } from "@/hooks/useCraftConnectionsQuery";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function EmailCard() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const craftId = useEditCraftStore((state) => state.craft.id);
  const { data: connections } = useCraftConnectionsQuery(craftId);
  const mutation = useCraftConnectionsMutation(craftId);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        email: {
          email: values.email,
        },
      },
      {
        onSuccess: () => {
          setShowSuccessModal(true);
          form.reset();
        },
      }
    );
  });

  const handleDisconnect = () => {
    mutation.mutate({ email: null });
  };

  return (
    <ConnectionCard
      title="Email"
      description="Send submissions to an email."
      icon={MailIcon}
      iconClassName="text-red-500"
    >
      {!connections?.email && (
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <FormField
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Email address"
                    type="email"
                    required
                  />
                )}
              />
              <Button type="submit">
                {mutation.status === "pending" ? (
                  <LoaderCircle className="animate-spin size-4" />
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {connections?.email && (
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={connections.email.email}
            className="bg-secondary"
          />
          {connections.email.confirmedAt ? (
            <CheckCircle2 className="text-emerald-500 size-8" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleXIcon className="size-6 cursor-default" />
                </TooltipTrigger>
                <TooltipContent>
                  Email not confirmed. Check your inbox for a confirmation
                  email.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button onClick={handleDisconnect} variant="destructive">
            {mutation.status === "pending" ? (
              <LoaderCircle className="animate-spin size-4" />
            ) : (
              "Disconnect"
            )}
          </Button>
        </div>
      )}

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Almost there!</DialogTitle>
            <DialogDescription>
              Please confirm your email address.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="text-sm">
              We&apos;ve sent a confirmation email to{" "}
              <strong>{connections?.email?.email}</strong>. Please check your
              inbox and click the confirmation link to complete the connection.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConnectionCard>
  );
}
