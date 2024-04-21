import type { ThemeImageType } from "@/lib/craftPageConfig/theming";
import { UnsplashTab } from "./UnsplashTab";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  open: boolean;
  currentValue?: ThemeImageType;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (image?: ThemeImageType) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ImageLibrary(props: Props) {
  const { open, onOpenChange, onImageSelect, onCancel, onSave } = props;

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
      <Tabs defaultValue="unsplash">
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              <TabsList className="">
                <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
            </SheetTitle>
            <UnsplashTab
              currentValue={props.currentValue}
              onImageSelect={onImageSelect}
              onCancel={onCancel}
              onSave={onSave}
            />
            <TabsContent value="upload" asChild>
              <div>Upload</div>
            </TabsContent>
          </SheetHeader>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
}
