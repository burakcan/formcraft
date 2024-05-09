import type { CraftVersion } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { craftPageDefinitions } from "@/craftPages";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
  editingVersion: CraftVersion;
}

export function ContentTab(props: Props) {
  const { selectedPage, editPage } = props;
  const pageDefinition = craftPageDefinitions[selectedPage.type];

  return (
    <ScrollArea className="flex-1">
      <pageDefinition.settingsComponent
        page={selectedPage as never}
        onChange={(value) => editPage(selectedPage.id, value)}
      />
    </ScrollArea>
  );
}
