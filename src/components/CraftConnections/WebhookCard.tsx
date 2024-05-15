"use client";

import { LoaderCircle, Webhook } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCraftConnectionsMutation } from "@/hooks/useCraftConnectionsMutation";
import { useCraftConnectionsQuery } from "@/hooks/useCraftConnectionsQuery";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
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
import { ConnectionCard } from "./ConnectionCard";

export function WebhookCard() {
  const [showSecretModal, setShowSecretModal] = useState(false);
  const craftId = useEditCraftStore((state) => state.craft.id);
  const { data: connections } = useCraftConnectionsQuery(craftId);
  const mutation = useCraftConnectionsMutation(craftId);

  const form = useForm({
    defaultValues: {
      url: "",
    },
  });

  const handleConnect = form.handleSubmit((values) => {
    mutation.mutate(
      {
        webhook: {
          url: values.url,
        },
      },
      {
        onSuccess: () => {
          setShowSecretModal(true);
          form.reset();
        },
      }
    );
  });

  const handleDisconnect = () => {
    mutation.mutate({ webhook: null });
  };

  return (
    <ConnectionCard
      title="Webhook"
      description="Send submissions to a webhook."
      icon={Webhook}
      iconClassName="text-blue-500"
    >
      {!connections?.webhook && (
        <Form {...form}>
          <form onSubmit={handleConnect}>
            <div className="flex gap-2">
              <FormField
                name="url"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Webhook URL"
                    type="url"
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

      {connections?.webhook && (
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={connections.webhook.url}
            className=" bg-secondary"
          />
          <Button
            disabled={mutation.isPending}
            variant="outline"
            onClick={() => setShowSecretModal(true)}
          >
            Show secret
          </Button>
          <Button onClick={handleDisconnect} variant="destructive">
            {mutation.status === "pending" ? (
              <LoaderCircle className="animate-spin size-4" />
            ) : (
              "Disconnect"
            )}
          </Button>
        </div>
      )}

      <Dialog open={showSecretModal} onOpenChange={setShowSecretModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Successfully connected to the webhook</DialogTitle>
            <DialogDescription>
              You can now start receiving submissions on your webhook.
              <br />
              Here is the secret key you can use to verify the authenticity of
              the requests.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              readOnly
              value={connections?.webhook?.secret}
              className="bg-secondary"
            />
            <small>
              Keep it safe and do not share it with anyone. You can check the
              authenticity of the requests by verifying the{" "}
              <code className="bg-primary text-primary-foreground p-0.5">
                X-FormCraft-Signature
              </code>{" "}
              header with this secret key.
            </small>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSecretModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConnectionCard>
  );
}
