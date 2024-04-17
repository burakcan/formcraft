import { LayoutPanelLeftIcon } from "lucide-react";
import { ImageInput } from "../ImageInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
}

export function ContentTab(props: Props) {
  const { selectedPage, editPage } = props;

  return (
    <div className="px-2 flex flex-col gap-2">
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
        label="Media"
        value={selectedPage.media}
        onChange={(media) => {
          editPage(selectedPage.id, {
            ...selectedPage,
            media: media,
          });
        }}
      />

      <div className="flex justify-between items-center">
        <Label className="font-normal">Media layout</Label>
        <ToggleGroup
          type="single"
          size="sm"
          value={selectedPage.mediaLayout}
          onValueChange={(value) => {
            if (!value) return;

            editPage(selectedPage.id, {
              ...selectedPage,
              mediaLayout: value as FormCraft.CraftPage["mediaLayout"],
            });
          }}
        >
          <ToggleGroupItem value="left-full">
            <LayoutPanelLeftIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right-full">
            <LayoutPanelLeftIcon className="size-4 rotate-180" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
