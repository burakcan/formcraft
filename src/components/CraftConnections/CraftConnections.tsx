import { MessageCircleQuestionIcon } from "lucide-react";
import { FaSlack } from "react-icons/fa";
import { Button } from "../ui/button";
import { ConnectionCard } from "./ConnectionCard";
import { EmailCard } from "./EmailCard";
import { GoogleSheetsCard } from "./GoogleSheetsCard";
import { WebhookCard } from "./WebhookCard";

export function CraftConnections() {
  return (
    <div className="w-full p-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold">Connect</h1>
        <p className="text-gray-500 mt-2">
          Connect your form to your favorite apps and services.
        </p>
      </div>
      <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-2 my-4 pb-24">
        <WebhookCard />
        <EmailCard />
        <GoogleSheetsCard />
        <ConnectionCard
          title="Slack"
          description="Send submissions to a Slack channel."
          icon={FaSlack}
          iconClassName="text-purple-500"
        >
          <div className="flex justify-end">
            <Button disabled>Coming soon</Button>
          </div>
        </ConnectionCard>
        <ConnectionCard
          title="Another integration"
          description="Do you have a suggestion for an integration? Let us know!"
          icon={MessageCircleQuestionIcon}
          iconClassName="text-gray-500"
        >
          <div className="flex justify-end">
            <Button>Request integration</Button>
          </div>
        </ConnectionCard>
      </div>
    </div>
  );
}
