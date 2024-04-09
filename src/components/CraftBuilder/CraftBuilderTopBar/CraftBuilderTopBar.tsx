import type { User } from "@clerk/nextjs/server";
import type { Craft } from "@prisma/client";
import { ArrowLeft, EyeIcon, LinkIcon, SaveIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/AppChrome";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  craft: Craft;
  user: User;
  orgName?: string;
  activeTab: "create" | "flow" | "connect" | "share" | "results";
}

export function CraftBuilderTopBar(props: Props) {
  const { craft, orgName, user, activeTab } = props;

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
                {orgName || user?.firstName}&apos;s Workspace
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{craft.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex-1" />
      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="create" asChild>
            <Link href={`/form/${craft.id}/edit`}>Create</Link>
          </TabsTrigger>
          <TabsTrigger value="flow" asChild>
            <Link href={`/form/${craft.id}/edit/flow`}>Flow</Link>
          </TabsTrigger>
          <TabsTrigger value="connect" asChild>
            <Link href={`/form/${craft.id}/edit/connect`}>Connect</Link>
          </TabsTrigger>
          <TabsTrigger value="share" asChild>
            <Link href={`/form/${craft.id}/edit/share`}>Share</Link>
          </TabsTrigger>
          <TabsTrigger value="results" asChild>
            <Link href={`/form/${craft.id}/edit/results`}>Results</Link>
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
        <Button size="icon" variant="outline">
          <SaveIcon className="size-4" />
        </Button>
        <Button>
          Publish
          <SendIcon className="size-4 ml-2" />
        </Button>
      </div>
    </TopBar>
  );
}
