// eslint-disable-next-line sort/imports
import "react-fontpicker-ts/dist/index.css";
import "./fontpicker.css";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronLeft,
  LayoutPanelLeftIcon,
} from "lucide-react";
import { useState } from "react";
import FontPicker from "react-fontpicker-ts";
import { defaultTheme } from "@/lib/themes/defaultTheme";
import { ImageInput } from "../ImageInput";
import { ColorInput } from "./ColorInput";
import { NewThemeModal } from "./NewThemeModal";
import { RevertModal } from "./RevertModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemes } from "@/hooks/useThemes";
import { SaveThemeModal } from "./SaveThemeModal";
import { builtinThemes } from "@/lib/themes";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
  onGallery: () => void;
}

export function ThemeCustomization(props: Props) {
  const { selectedPage, editPage, onGallery } = props;
  const [showRevertConfirmation, setShowRevertConfirmation] = useState(false);
  const [showSaveAsNewModal, setShowSaveAsNewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
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

      <SaveThemeModal
        data={theme}
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
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
        <div className="flex-1" />
        <Button
          size="sm"
          variant="outline"
          disabled={
            Object.keys(overrides).length === 0 ||
            Boolean(builtinThemes[theme.id])
          }
          onClick={() => setShowSaveModal(true)}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={Object.keys(overrides).length === 0}
          onClick={() => setShowSaveAsNewModal(true)}
        >
          Save as...
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
          <div className="flex flex-col gap-2">
            <Label>Title Font</Label>
            <FontPicker
              defaultValue={theme.titleFont}
              value={(value) => {
                if (value === theme.titleFont) return;
                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    titleFont: value,
                  },
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description Font</Label>
            <FontPicker
              defaultValue={theme.descriptionFont}
              value={(value) => {
                if (value === theme.descriptionFont) return;
                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    descriptionFont: value,
                  },
                });
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>Text size</Label>
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
            <Label>Align</Label>
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
          <ImageInput
            label="Background image"
            value={theme.backgroundImage}
            onChange={(value) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  backgroundImage: value || null,
                },
              });
            }}
          />
          <ImageInput
            label="Decoration image"
            value={theme.decorationImage}
            onChange={(value) => {
              editPage(selectedPage.id, {
                ...selectedPage,
                themeOverride: {
                  ...overrides,
                  decorationImage: value || null,
                  decorationImageLayout:
                    selectedPage.themeOverride.decorationImageLayout ||
                    "left-full",
                },
              });
            }}
          />
          <div className="flex justify-between items-center">
            <Label>Decoration layout</Label>
            <ToggleGroup
              type="single"
              size="sm"
              value={theme.decorationImageLayout}
              onValueChange={(value) => {
                if (!value) return;

                editPage(selectedPage.id, {
                  ...selectedPage,
                  themeOverride: {
                    ...overrides,
                    decorationImageLayout: value as "left-full" | "right-full",
                  },
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
      </ScrollArea>
    </>
  );
}
