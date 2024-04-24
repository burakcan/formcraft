import {
  MailIcon,
  MessageCircleQuestionIcon,
  SheetIcon,
  Webhook,
} from "lucide-react";
import { FaSlack } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ConnectionCard } from "./ConnectionCard";

export function CraftConnections() {
  return (
    <div className="w-full p-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold">Connect</h1>
        <p className="text-gray-500 mt-2">
          Connect your form to your favorite apps and services.
        </p>
      </div>
      <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-4 my-4 pb-24">
        <ConnectionCard
          title="Google Sheets"
          description="Send submissions to a Google Sheet."
          icon={SheetIcon}
          iconClassName="text-green-500"
        >
          <div className="flex justify-end">
            <Button>Authorize</Button>
          </div>
        </ConnectionCard>
        <ConnectionCard
          title="Webhook"
          description="Send submissions to a webhook."
          icon={Webhook}
          iconClassName="text-blue-500"
        >
          <div className="flex justify-end">
            <Button>Setup</Button>
          </div>
        </ConnectionCard>
        <ConnectionCard
          title="Email"
          description="Send submissions to an email."
          icon={MailIcon}
          iconClassName="text-red-500"
        >
          <div className="flex gap-2">
            <Input placeholder="Email address" type="email" />
            <Button>Connect</Button>
          </div>
        </ConnectionCard>
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
