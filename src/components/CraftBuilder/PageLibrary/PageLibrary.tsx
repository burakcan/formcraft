import { ImagesIcon, PlusIcon } from "lucide-react";
import { nanoid } from "nanoid";
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
  pageDefinition: FormCraft.CraftPageDefinition;
  onClick: () => void;
}

function LibraryItem(props: LibraryItemProps) {
  const { pageDefinition } = props;
  const { icon: Icon, iconClassName, name, description } = pageDefinition;

  return (
    <SheetClose asChild>
      <div
        className="flex items-center p-2 cursor-default rounded hover:bg-gray-100"
        onClick={props.onClick}
      >
        <div className={cn("mr-2 p-2 rounded", iconClassName)}>
          <Icon className={cn("size-4", iconClassName)} />
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
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

  const handleAddPage = (
    type: FormCraft.CraftPage["type"],
    defaults: Partial<FormCraft.CraftPage> = {}
  ) => {
    const id = nanoid(5);

    const common = {
      id,
      type,
      title: "",
      description: "",
      baseThemeId: defaultThemeForNewPages,
      logo: defaultLogoForNewPages,
    };

    switch (type) {
      default:
        addPage(
          craftPageDefinitions[type].editorSchema.parse({
            ...common,
            ...defaults,
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
              pageDefinition={craftPageDefinitions["statement"]}
              onClick={() => handleAddPage("statement")}
            />
            <div />
            <LibraryItem
              pageDefinition={craftPageDefinitions["short_text"]}
              onClick={() => handleAddPage("short_text")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["long_text"]}
              onClick={() => handleAddPage("long_text")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["number_input"]}
              onClick={() => handleAddPage("number_input")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["date_text"]}
              onClick={() => handleAddPage("date_text")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["email"]}
              onClick={() => handleAddPage("email")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["website"]}
              onClick={() => handleAddPage("website")}
            />
            <LibraryItem
              pageDefinition={craftPageDefinitions["phone_number"]}
              onClick={() => handleAddPage("phone_number")}
            />
            <div />
            <LibraryItem
              pageDefinition={craftPageDefinitions["choices"]}
              onClick={() => handleAddPage("choices")}
            />
            <LibraryItem
              pageDefinition={{
                ...craftPageDefinitions["choices"],
                name: "Image choices",
                icon: ImagesIcon,
                description: "Select an image from a list",
              }}
              onClick={() =>
                handleAddPage("choices", {
                  imageChoices: true,
                })
              }
            />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
