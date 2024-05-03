import {
  EllipsisVertical,
  ReplaceAllIcon,
  // TextCursorInputIcon,
  TrashIcon,
  WandIcon,
} from "lucide-react";
import FontPicker from "react-fontpicker-ts";
import { cn } from "@/lib/utils";
import { ThemeImage } from "../../PageRenderer/ThemeImage";
import { ThemeStyle } from "../../PageRenderer/ThemeStyle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  selected?: boolean;
  onSelect?: (themeId: string) => void;
  onApplyToAll?: () => void;
  onDelete?: () => void;
  hasOverrides?: boolean;
  hideName?: boolean;
  large?: boolean;
  isBuiltin?: boolean;
}

export function ThemeCard(props: Props) {
  const domId = "t" + props.theme.id.replaceAll("-", "");
  const {
    theme,
    selected,
    onSelect,
    hasOverrides,
    hideName,
    large,
    isBuiltin,
    onApplyToAll,
    onDelete,
  } = props;

  return (
    <>
      {"document" in global && (
        <FontPicker
          loaderOnly
          loadFonts={[theme.titleFont, theme.descriptionFont]}
          loadAllVariants
        />
      )}
      <div
        id={domId}
        onClick={() => {
          onSelect && onSelect(theme.id);
        }}
        className={cn(
          "craft-renderer group border bg-craft-background rounded-md cursor-default overflow-hidden relative select-none flex items-start flex-col justify-center",
          {
            "ring-2 ring-blue-500": selected,
            "size-24": large,
          }
        )}
      >
        <ThemeStyle theme={theme} pageId={domId} />
        {theme.backgroundImage && (
          <ThemeImage imageObject={theme.backgroundImage} noAttribution />
        )}
        <div className="p-2 z-10 relative w-full">
          <h1 className="text-2xl font-bold text-craft-title font-craft-title">
            Aa
          </h1>
          <div className="text-craft-description font-craft-description">
            Aa{" "}
            <Badge className="font-sans bg-craft-button text-craft-button-text hover:bg-craft-button hover:opacity-60">
              Aa
            </Badge>
          </div>
          {Boolean(hasOverrides && selected) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-1 top-1">
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 border-amber-700 text-amber-700 px-2"
                  >
                    <WandIcon className="size-4" />
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Customized</TooltipContent>
            </Tooltip>
          )}
        </div>
        {!hideName && (
          <div className="p-1 bg-background border-t text-xs z-10 relative w-full flex justify-between items-center">
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {theme.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="size-6 flex-none opacity-40 group-hover:opacity-100"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DropdownMenuItem
                  onSelect={() => {
                    onApplyToAll && onApplyToAll();
                  }}
                >
                  <ReplaceAllIcon className="mr-2 h-4 w-4" />
                  <span>Apply to all</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={isBuiltin}
                  onSelect={() => {
                    onDelete && onDelete();
                  }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem disabled={isBuiltin}>
                  <TextCursorInputIcon className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
}
