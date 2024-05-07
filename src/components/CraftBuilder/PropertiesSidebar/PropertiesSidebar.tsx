"use client";

import { ContentTab } from "./ContentTab";
import { DesignTab } from "./DesignTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

export function PropertiesSidebar() {
  const { editingVersion, selectedPage, editPage } = useEditCraftStore((s) => ({
    editingVersion: s.editingVersion,
    selectedPage: s.getSelectedPage(),
    editPage: s.editPage,
  }));

  if (!selectedPage) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="content" className="h-full flex flex-col">
        <TabsList className="w-full h-10 rounded-none flex-none">
          <TabsTrigger value="content">Page Content</TabsTrigger>
          <TabsTrigger value="design">Page Design</TabsTrigger>
        </TabsList>
        <TabsContent
          value="content"
          className="relative flex-1 m-0 h-[calc(100%-theme(spacing[10]))]"
        >
          <div className="relative flex flex-col m-0 h-full">
            <ContentTab
              selectedPage={selectedPage}
              editPage={editPage}
              editingVersion={editingVersion}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="design"
          className="relative flex-1 m-0 h-[calc(100%-theme(spacing[10]))]"
        >
          <div className="relative flex flex-col m-0 h-full">
            <DesignTab selectedPage={selectedPage} editPage={editPage} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
