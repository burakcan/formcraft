import type { CraftVersion } from "@prisma/client";
import { CheckCircle2, CircleHelpIcon, ReplaceAllIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageInput } from "../ImageInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
  editingVersion: CraftVersion;
}

export function ContentTab(props: Props) {
  const { applyLogoToAll } = useEditCraftStore((s) => ({
    applyLogoToAll: s.applyLogoToAll,
  }));

  const { selectedPage, editPage } = props;

  return (
    <ScrollArea className="flex-1">
      <div className="px-2 pb-4 flex flex-col gap-4 pt-2">
        <div className="p-2 pt-0 border rounded flex flex-col gap-2">
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
        </div>

        {("minLength" in selectedPage ||
          "maxLength" in selectedPage ||
          "required" in selectedPage) && (
          <div className="p-2 pt-0 border rounded flex flex-col gap-2">
            {"minLength" in selectedPage && (
              <div>
                <Label htmlFor="minLength">Minimum length</Label>
                <Input
                  name="minLength"
                  type="number"
                  value={selectedPage.minLength ?? 0}
                  onChange={(e) => {
                    editPage(selectedPage.id, {
                      ...selectedPage,
                      minLength: parseInt(e.target.value, 10),
                    });
                  }}
                />
              </div>
            )}

            {"maxLength" in selectedPage && (
              <div>
                <Label htmlFor="maxLength">Maximum length</Label>
                <Input
                  name="maxLength"
                  type="number"
                  value={selectedPage.maxLength || ""}
                  onChange={(e) => {
                    editPage(selectedPage.id, {
                      ...selectedPage,
                      maxLength: parseInt(e.target.value, 10),
                    });
                  }}
                />
              </div>
            )}

            {"required" in selectedPage && (
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="required">Required</Label>
                <Checkbox
                  name="required"
                  checked={selectedPage.required}
                  onCheckedChange={(checked) => {
                    editPage(selectedPage.id, {
                      ...selectedPage,
                      required: checked === true,
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {("showCta" in selectedPage ||
          "cta" in selectedPage ||
          "ctaLink" in selectedPage) && (
          <div className="p-2 pt-0 border rounded flex flex-col gap-2">
            {"showCta" in selectedPage && (
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="showCta">Show button</Label>
                <Checkbox
                  name="showCta"
                  checked={selectedPage.showCta}
                  onCheckedChange={(checked) => {
                    editPage(selectedPage.id, {
                      ...selectedPage,
                      showCta: checked === true,
                    });
                  }}
                />
              </div>
            )}

            {"cta" in selectedPage &&
              (("showCta" in selectedPage && selectedPage.showCta) ||
                !("showCta" in selectedPage)) && (
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

            {"ctaLink" in selectedPage &&
              (("showCta" in selectedPage && selectedPage.showCta) ||
                !("showCta" in selectedPage)) && (
                <div>
                  <Label htmlFor="ctaLink">Button link</Label>
                  <Input
                    name="ctaLink"
                    value={selectedPage.ctaLink}
                    onChange={(e) => {
                      editPage(selectedPage.id, {
                        ...selectedPage,
                        ctaLink: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
          </div>
        )}

        <div className="p-2 pt-0 border rounded flex flex-col gap-1">
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
                applyLogoToAll(selectedPage.logo);
                toast.success("Logo applied to all pages", {
                  icon: <CheckCircle2 />,
                  description: "This logo will be the default for new pages.",
                });
              }}
            >
              Apply logo to all pages
              <ReplaceAllIcon className="size-4 ml-2" />
            </Button>
          </div>
        </div>

        {selectedPage.type !== "statement" &&
          selectedPage.type !== "end_screen" && (
            <div className="p-2 pt-0 border rounded flex flex-col gap-2">
              <div>
                <Label htmlFor="variableName">
                  Variable name
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleHelpIcon className="size-4 ml-1 inline-block" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        You can refer to this answer in the next pages by using{" "}
                        <br />
                        this variable name like <code>{`{variable_name}`}</code>
                        .
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
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
            </div>
          )}
      </div>
    </ScrollArea>
  );
}
