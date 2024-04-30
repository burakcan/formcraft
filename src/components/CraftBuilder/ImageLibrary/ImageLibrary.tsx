import { Upload } from "lucide-react";
import { UnsplashTab } from "./UnsplashTab";
import { UploadTab } from "./UploadTab";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ThemeImageType } from "@/craftPages/schemas/theming";

interface Props {
  open: boolean;
  currentValue?: ThemeImageType;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (image?: ThemeImageType) => void;
  onSave: () => void;
  onCancel: () => void;
  defaultTab?: "unsplash" | "upload" | "library";
}

export function ImageLibrary(props: Props) {
  const { open, onOpenChange, onImageSelect, onCancel, onSave, defaultTab } =
    props;

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
      <Tabs defaultValue={defaultTab || "unsplash"}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              <TabsList className="">
                <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                {/* <TabsTrigger value="library">Library</TabsTrigger> */}
              </TabsList>
            </SheetTitle>
            <UnsplashTab
              currentValue={props.currentValue}
              onImageSelect={onImageSelect}
              onCancel={onCancel}
              onSave={onSave}
            />

            <TabsContent value="upload" asChild>
              <UploadTab
                onCancel={onCancel}
                onSave={onSave}
                onImageSelect={onImageSelect}
              />
            </TabsContent>
            <TabsContent value="library" asChild>
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Upload size={24} />
                  <span className="text-sm">Upload from library</span>
                </div>
              </div>
            </TabsContent>
          </SheetHeader>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
}
