import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopBar } from "@/components/AppChrome";
import { BlockerLink } from "@/components/CraftNavigationBlock";
import { AutoSave } from "../AutoSave";
import { Avatar } from "./Avatar";
import { CraftName } from "./CraftName";
import { CraftStatusBadge } from "./CraftStatusBadge";
import { PreviewButton } from "./PreviewButton";
import { SaveAndPublishButton } from "./SaveAndPublishButton";
import { UndoRedo } from "./UndoRedo";

interface Props {
  craft_id: string;
  activeTab: "create" | "flow" | "connect" | "share" | "results";
  hideUndoRedo?: boolean;
  hidePreview?: boolean;
  hideAutoSave?: boolean;
}

export function CraftBuilderTopBar(props: Props) {
  const {
    craft_id,
    activeTab,
    hideUndoRedo = false,
    hidePreview = false,
    hideAutoSave = false,
  } = props;

  return (
    <TopBar className="flex items-center gap-2">
      <div className="flex h-full items-center gap-2">
        <BlockerLink href="/dashboard" className="h-full flex items-center">
          <div className="w-12 flex items-center justify-center">
            <ArrowLeft className="size-5" />
          </div>
          <Avatar />
        </BlockerLink>
        <CraftName />
      </div>
      <div>
        <Tabs defaultValue={activeTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="create" asChild>
              <Link href={`/form/${craft_id}/edit`}>Create</Link>
            </TabsTrigger>
            <TabsTrigger value="flow" asChild>
              <Link href={`/form/${craft_id}/flow`}>Flow</Link>
            </TabsTrigger>
            <TabsTrigger value="connect" asChild>
              <BlockerLink href={`/form/${craft_id}/connect`}>
                Connect
              </BlockerLink>
            </TabsTrigger>
            <TabsTrigger value="share" asChild>
              <BlockerLink href={`/form/${craft_id}/share`}>Share</BlockerLink>
            </TabsTrigger>
            <TabsTrigger value="results" asChild>
              <BlockerLink href={`/form/${craft_id}/results`}>
                Results
              </BlockerLink>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1" />
      {!hideAutoSave && <AutoSave />}
      <CraftStatusBadge />
      <div className="flex gap-2 pr-4 justify-end">
        {!hideUndoRedo && <UndoRedo />}
        {!hidePreview && <PreviewButton />}
        <SaveAndPublishButton />
      </div>
    </TopBar>
  );
}
