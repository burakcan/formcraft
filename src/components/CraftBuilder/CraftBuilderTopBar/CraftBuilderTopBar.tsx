import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, EyeIcon, LinkIcon } from "lucide-react";
import Link from "next/link";
import { CraftName } from "./CraftName";
import { SaveAndPublishButton } from "./SaveAndPublishButton";
import { SaveButton } from "./SaveButton";
import { TopBar } from "@/components/AppChrome";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface Props {
  craft_id: string;
  activeTab: "create" | "flow" | "connect" | "share" | "results";
}

export async function CraftBuilderTopBar(props: Props) {
  const { craft_id, activeTab } = props;

  let workspaceName: string | undefined | null = null;

  const { sessionClaims } = auth();

  if (sessionClaims?.org_name) {
    workspaceName = sessionClaims.org_name as string;
  } else {
    const user = await currentUser();
    workspaceName = user?.firstName;
  }

  return (
    <TopBar className="flex items-center">
      <Link
        href="/dashboard"
        className="h-full w-16 flex items-center justify-center"
      >
        <ArrowLeft className="size-5" />
      </Link>
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                {workspaceName === null
                  ? "Dashboard"
                  : `${workspaceName}'s Workspace`}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <CraftName />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex-1" />
      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="create" asChild>
            <Link href={`/form/${craft_id}/edit`}>Create</Link>
          </TabsTrigger>
          <TabsTrigger value="flow" asChild>
            <Link href={`/form/${craft_id}/edit/flow`}>Flow</Link>
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
      <div className="flex-1" />
      <div className="flex gap-2 pr-4">
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
