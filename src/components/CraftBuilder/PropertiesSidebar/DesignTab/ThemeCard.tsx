import {
  EllipsisVertical,
  ReplaceAllIcon,
  TextCursorInputIcon,
  TrashIcon,
  WandIcon,
} from "lucide-react";
import FontPicker from "react-fontpicker-ts";
import { cn } from "@/lib/utils";
import { ThemeImage } from "../../PageRenderer/ThemeImage";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  selected?: boolean;
  onSelect?: (themeId: string) => void;
  hasOverrides?: boolean;
  hideName?: boolean;
  large?: boolean;
  isBuiltin?: boolean;
}

export function ThemeCard(props: Props) {
  const {
    theme,
    selected,
    onSelect,
    hasOverrides,
    hideName,
    large,
    isBuiltin,
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
        style={{
          backgroundColor: theme.backgroundColor,
        }}
        onClick={() => {
          onSelect && onSelect(theme.id);
        }}
        className={cn(
          "group border rounded-md cursor-default overflow-hidden relative select-none flex items-start flex-col justify-center",
          {
            "ring-2 ring-blue-500": selected,
            "size-24": large,
          }
        )}
      >
        {theme.backgroundImage && (
          <ThemeImage imageObject={theme.backgroundImage} noAttribution />
        )}
        <div className="p-2 z-10 relative w-full">
          <h1
            style={{
              color: theme.titleColor,
              fontFamily: theme.titleFont,
            }}
            className="text-2xl font-bold"
          >
            Aa
          </h1>
          <div
            style={{
              color: theme.descriptionColor,
              fontFamily: theme.descriptionFont,
            }}
          >
            Aa{" "}
            <Badge
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
              className="font-sans"
            >
              Aa
            </Badge>
          </div>
          {Boolean(hasOverrides && selected) && (
            <TooltipProvider>
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
            </TooltipProvider>
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
                <DropdownMenuItem>
                  <ReplaceAllIcon className="mr-2 h-4 w-4" />
                  <span>Apply to all</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={isBuiltin}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isBuiltin}>
                  <TextCursorInputIcon className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
}
