import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";

export function PropertiesSidebar() {
  return (
    <div className="w-full h-full">
      <Tabs defaultValue="content">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
