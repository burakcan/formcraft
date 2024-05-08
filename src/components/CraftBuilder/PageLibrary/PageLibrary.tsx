import {
  BookOpenTextIcon,
  MegaphoneIcon,
  PlusIcon,
  TextCursorInputIcon,
} from "lucide-react";
import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { craftPageDefinitions } from "@/craftPages";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

interface LibraryItemProps {
  title: string;
  description: string;
  onClick: () => void;
  icon: React.ReactNode;
  iconClassName?: string;
}

function LibraryItem(props: LibraryItemProps) {
  return (
    <SheetClose asChild>
      <div
        className="flex items-center p-2 cursor-default rounded hover:bg-gray-100"
        onClick={props.onClick}
      >
        <div className={cn("mr-2 p-2 rounded", props.iconClassName)}>
          {props.icon}
        </div>
        <div>
          <div className="text-sm font-medium">{props.title}</div>
          <div className="text-sm text-muted-foreground">
            {props.description}
          </div>
        </div>
      </div>
    </SheetClose>
  );
}

export function PageLibrary() {
  const {
    setSelectedPage,
    addPage,
    defaultThemeForNewPages,
    defaultLogoForNewPages,
  } = useEditCraftStore((s) => ({
    setSelectedPage: s.setSelectedPage,
    defaultThemeForNewPages: s.editingVersion.data.defaultTheme,
    defaultLogoForNewPages: s.editingVersion.data.defaultLogo,
    addPage: s.addPage,
  }));

  const handleAddPage = (type: FormCraft.CraftPage["type"]) => {
    const id = uuid();

    const common = {
      id,
      type,
      title: "Untitled Page",
      description: "",
      baseThemeId: defaultThemeForNewPages,
      logo: defaultLogoForNewPages,
    };

    switch (type) {
      default:
        addPage(
          craftPageDefinitions[type].editorSchema.parse({
            ...common,
          })
        );
        break;
    }

    setSelectedPage(id);
  };

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="size-10">
          <PlusIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Add content</SheetTitle>
          <SheetDescription>
            Choose a content type to add to your form.
          </SheetDescription>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <LibraryItem
              title={craftPageDefinitions["statement"].name}
              description={craftPageDefinitions["statement"].description}
              onClick={() => handleAddPage("statement")}
              icon={<MegaphoneIcon className="size-4" />}
              iconClassName={craftPageDefinitions["statement"].iconClassName}
            />
            <div />
            <LibraryItem
              title={craftPageDefinitions["short_text"].name}
              description={craftPageDefinitions["short_text"].description}
              onClick={() => handleAddPage("short_text")}
              icon={<TextCursorInputIcon className="size-4" />}
              iconClassName={craftPageDefinitions["short_text"].iconClassName}
            />
            <LibraryItem
              title={craftPageDefinitions["long_text"].name}
              description={craftPageDefinitions["long_text"].description}
              onClick={() => handleAddPage("long_text")}
              icon={<BookOpenTextIcon className="size-4" />}
              iconClassName={craftPageDefinitions["long_text"].iconClassName}
            />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
