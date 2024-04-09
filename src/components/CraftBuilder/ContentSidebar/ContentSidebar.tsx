import type { CraftVersion } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../ui/resizable";

interface Props {
  craftVersion: CraftVersion;
}

export function ContentSidebar(props: Props) {
  const { craftVersion } = props;

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="vertical" autoSaveId="fc_content_sidebar">
        <ResizablePanel>
          <div className="flex items-center justify-between py-2 mx-2 text-sm font-medium border-b">
            Content
            <Button variant="secondary" size="icon" className="size-10">
              <PlusIcon className="size-4" />
            </Button>
          </div>
          <div>
            {craftVersion.data.pages.map((page) => (
              <div key={page.id} className="p-2 text-sm bg-accent rounded m-2">
                {page.title}
              </div>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex items-center justify-between py-2 mx-2 text-sm font-medium border-b">
            Endings
            <Button variant="secondary" size="icon" className="size-10">
              <PlusIcon className="size-4" />
            </Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
