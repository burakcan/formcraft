import type { CraftVersion } from "@prisma/client";
import { CheckCircle2, CircleHelpIcon, ReplaceAllIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageInput } from "../ImageInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
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
        <div className="p-2 pt-1 border rounded flex flex-col gap-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              className="h-8 mt-1"
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
              className="h-8 mt-1"
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

        {selectedPage.type !== "statement" &&
          selectedPage.type !== "end_screen" && (
            <div className="p-2 pt-1 border rounded flex flex-col gap-2">
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
                  className="h-8 mt-1"
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

        <div
          className={cn("p-2 pt-1 border rounded flex flex-col gap-2", {
            hidden: !(
              "minLength" in selectedPage ||
              "maxLength" in selectedPage ||
              "minValue" in selectedPage ||
              "maxValue" in selectedPage ||
              "required" in selectedPage
            ),
          })}
        >
          {"maxValue" in selectedPage && (
            <div>
              <Label htmlFor="maxValue">Maximum Value</Label>
              <Input
                min={0}
                className="h-8 mt-1"
                name="maxValue"
                type="number"
                value={selectedPage.maxValue ?? ""}
                onChange={(e) => {
                  editPage(selectedPage.id, {
                    ...selectedPage,
                    maxValue: parseInt(e.target.value, 10),
                  });
                }}
              />
            </div>
          )}

          {"minValue" in selectedPage && selectedPage.required && (
            <div>
              <Label htmlFor="minValue">Minimum Value</Label>
              <Input
                min={0}
                className="h-8 mt-1"
                name="minValue"
                type="number"
                value={selectedPage.minValue ?? ""}
                onChange={(e) => {
                  editPage(selectedPage.id, {
                    ...selectedPage,
                    minValue: parseInt(e.target.value, 10),
                  });
                }}
              />
            </div>
          )}

          {"minLength" in selectedPage && (
            <div>
              <Label htmlFor="minLength">Minimum length</Label>
              <Input
                className="h-8 mt-1"
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
                className="h-8 mt-1"
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
              <Switch
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

        {("showCta" in selectedPage ||
          "cta" in selectedPage ||
          "ctaLink" in selectedPage) && (
          <div className="p-2 pt-1 border rounded flex flex-col gap-2">
            {"showCta" in selectedPage && (
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="showCta">Show button</Label>
                <Switch
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
                    className="h-8 mt-1"
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
                    className="h-8 mt-1"
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
            hideTabs
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
                });
              }}
            >
              Apply logo to all pages
              <ReplaceAllIcon className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
