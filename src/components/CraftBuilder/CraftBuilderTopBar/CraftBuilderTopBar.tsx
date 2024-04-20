import { ArrowLeft, EyeIcon, LinkIcon } from "lucide-react";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { CraftName } from "./CraftName";
import { SaveAndPublishButton } from "./SaveAndPublishButton";
import { SaveButton } from "./SaveButton";
import { TopBar } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  craft_id: string;
  activeTab: "create" | "flow" | "connect" | "share" | "results";
}

export function CraftBuilderTopBar(props: Props) {
  const { craft_id, activeTab } = props;

  return (
    <TopBar className="grid grid-cols-3 items-center">
      <div className="flex h-full items-center gap-2">
        <Link href="/dashboard" className="h-full flex items-center">
          <div className="w-12 flex items-center justify-center">
            <ArrowLeft className="size-5" />
          </div>
          <Avatar />
        </Link>
        <CraftName />
      </div>
      <div className="">
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger value="create" asChild>
              <Link href={`/form/${craft_id}/edit`}>Create</Link>
            </TabsTrigger>
            <TabsTrigger value="flow" asChild>
              <Link href={`/form/${craft_id}/flow`}>Flow</Link>
            </TabsTrigger>
            <TabsTrigger value="connect" asChild>
              <Link href={`/form/${craft_id}/edit/connect`}>Connect</Link>
            </TabsTrigger>
            <TabsTrigger value="share" asChild>
              <Link href={`/form/${craft_id}/edit/share`}>Share</Link>
            </TabsTrigger>
            <TabsTrigger value="results" asChild>
              <Link href={`/form/${craft_id}/edit/results`}>Results</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex gap-2 pr-4 justify-end">
        <Button size="icon" variant="outline">
          <LinkIcon className="size-4" />
        </Button>
        <Button size="icon" variant="outline">
          <EyeIcon className="size-4" />
        </Button>
        <SaveButton />
        <SaveAndPublishButton />
      </div>
    </TopBar>
  );
}
