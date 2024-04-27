import type { CraftVersion } from "@prisma/client";
import { ReplaceAllIcon } from "lucide-react";
import { ImageInput } from "../ImageInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
  editingVersion: CraftVersion;
}

export function ContentTab(props: Props) {
  const { selectedPage, editPage, editingVersion } = props;

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 pb-4 flex flex-col gap-2 pt-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            value={selectedPage.title}
            onChange={(e) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                title: e.target.value,
              });
            }}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            name="description"
            value={selectedPage.description}
            onChange={(e) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                description: e.target.value,
              });
            }}
          />
        </div>

        <div>
          <Label htmlFor="variableName">Variable name</Label>
          <Input
            name="variableName"
            value={selectedPage.variableName || ""}
            onChange={(e) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                variableName: e.target.value,
              });
            }}
          />
        </div>

        {"cta" in selectedPage && (
          <div>
            <Label htmlFor="cta">Button text</Label>
            <Input
              name="cta"
              value={selectedPage.cta}
              onChange={(e) => {
                editPage(selectedPage.id, {
                  ...selectedPage,
                  cta: e.target.value,
                });
              }}
            />
          </div>
        )}

        <ImageInput
          label="Logo"
          defaultLibraryTab="upload"
          value={selectedPage.logo}
          onChange={(value) => {
            editPage(selectedPage.id, {
              ...selectedPage,
              logo: value,
            });
          }}
        />

        <div className="flex-1 w-full">
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            onClick={() => {
              editingVersion.data.pages.forEach((page) => {
                if (page.id !== selectedPage.id) {
                  editPage(page.id, {
                    ...page,
                    logo: selectedPage.logo,
                  });
                }
              });
            }}
          >
            Apply logo to all pages
            <ReplaceAllIcon className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
