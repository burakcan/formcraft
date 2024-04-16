import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { fonts } from "@/lib/fonts";
import { defaultTheme } from "@/lib/themes/defaultTheme";
import { ColorInput } from "./ColorInput";
import { ImageInput } from "./ImageInput";
import { NewThemeModal } from "./NewThemeModal";
import { RevertModal } from "./RevertModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemes } from "@/hooks/useThemes";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
  onGallery: () => void;
}

export function ThemeCustomization(props: Props) {
  const { selectedPage, editPage, onGallery } = props;
  const [showRevertConfirmation, setShowRevertConfirmation] = useState(false);
  const [showSaveAsNewModal, setShowSaveAsNewModal] = useState(false);
  const themes = useThemes();

  const baseTheme = themes[selectedPage.baseThemeId] || defaultTheme;
  const overrides = selectedPage.themeOverride || {};
  const theme = { ...baseTheme, ...overrides };

  const handleRevert = () => {
    editPage(selectedPage.id, {
      ...selectedPage,
      themeOverride: {},
    });

    setShowRevertConfirmation(false);
  };

  return (
    <>
      <RevertModal
        open={showRevertConfirmation}
        onOpenChange={setShowRevertConfirmation}
        onConfirm={handleRevert}
      />

      <NewThemeModal
        selectedPage={selectedPage}
        open={showSaveAsNewModal}
        onOpenChange={setShowSaveAsNewModal}
        data={theme}
      />

      <div className="border-b">
        <Button variant="link" onClick={onGallery}>
          <ChevronLeft className="size-4" />
          Themes
        </Button>
      </div>
      <div className="p-2 w-full bg-background border-b flex gap-2 justify-between">
        <Button
          size="sm"
          variant="outline"
          disabled={Object.keys(overrides).length === 0}
          onClick={() => setShowRevertConfirmation(true)}
        >
          Revert
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={Object.keys(overrides).length === 0}
          onClick={() => setShowSaveAsNewModal(true)}
        >
          Save as new theme
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4 flex flex-col gap-2 pt-2">
          <ColorInput
            label="Title color"
            value={theme.titleColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  titleColor: value,
                },
              })
            }
          />
          <ColorInput
            label="Description color"
            value={theme.descriptionColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  descriptionColor: value,
                },
              })
            }
          />
          <ColorInput
            label="Background color"
            value={theme.backgroundColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  backgroundColor: value,
                },
              })
            }
          />
          <ColorInput
            label="Button color"
            value={theme.buttonColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  buttonColor: value,
                },
              })
            }
          />
          <ColorInput
            label="Button text color"
            value={theme.buttonTextColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  buttonTextColor: value,
                },
              })
            }
          />
          <ColorInput
            label="Answers color"
            value={theme.answersColor}
            onChange={(value) =>
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  answersColor: value,
                },
              })
            }
          />
          <ImageInput
            value={theme.backgroundImageUrl}
            onChange={(value) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  backgroundImageUrl: value,
                },
              });
            }}
          />
          <div className="flex justify-between items-center">
            <Label className="font-normal">Text size</Label>
            <ToggleGroup
              type="single"
              size="sm"
              value={theme.fontSize}
              onValueChange={(value) => {
                if (!value) return;
                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    fontSize: value as "small" | "medium" | "large",
                  },
                });
              }}
            >
              <ToggleGroupItem
                value="small"
                className=" text-xs font-mono font-bold"
              >
                SM
              </ToggleGroupItem>
              <ToggleGroupItem
                value="medium"
                className=" text-xs font-mono font-bold"
              >
                MD
              </ToggleGroupItem>
              <ToggleGroupItem
                value="large"
                className=" text-xs font-mono font-bold"
              >
                LG
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex justify-between items-center">
            <Label className="font-normal">Align text</Label>
            <ToggleGroup
              type="single"
              size="sm"
              value={theme.textAlign}
              onValueChange={(value) => {
                if (!value) return;
                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    textAlign: value as "left" | "center" | "right",
                  },
                });
              }}
            >
              <ToggleGroupItem value="left">
                <AlignLeftIcon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenterIcon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRightIcon className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <Label className="font-normal">Font</Label>
            <Select
              value={theme.font}
              onValueChange={(value) => {
                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    font: value as keyof typeof fonts,
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue>{fonts[theme.font].name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(fonts).map((font) => (
                  <SelectItem value={font.id} key={font.id}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
