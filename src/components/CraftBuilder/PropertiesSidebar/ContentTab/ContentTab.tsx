import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
}

export function ContentTab(props: Props) {
  const { selectedPage, editPage } = props;

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
      </div>
    </ScrollArea>
  );
}
