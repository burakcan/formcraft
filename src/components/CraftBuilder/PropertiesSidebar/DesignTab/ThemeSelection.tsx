import { WandIcon } from "lucide-react";
import { useState } from "react";
import { builtinThemes } from "@/lib/themes";
import { ThemeCard } from "./ThemeCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemes } from "@/hooks/useThemes";

interface Props {
  onSelectTheme: (themeId: string) => void;
  selectedThemeId: string;
  onCustomize: () => void;
  hasOverrides: boolean;
}

export function ThemeSelection(props: Props) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmThemeId, setConfirmThemeId] = useState<string | null>(null);
  const { onSelectTheme, hasOverrides, selectedThemeId, onCustomize } = props;
  const themes = useThemes();

  const handleSelectTheme = (themeId: string) => {
    if (selectedThemeId !== themeId && hasOverrides) {
      setShowConfirmation(true);
      setConfirmThemeId(themeId);
      return;
    }

    onSelectTheme(themeId);
  };

  const handleConfirm = () => {
    if (confirmThemeId) {
      onSelectTheme(confirmThemeId);
    }
    setShowConfirmation(false);
  };

  return (
    <>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Override customizations</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the theme will override your customizations. Are you sure
              you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-destructive"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-2 w-full z-10 bg-background border-b flex flex-col flex-none">
        <Button size="sm" variant="outline" onClick={onCustomize}>
          Customize
          <WandIcon className="size-4 ml-2" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2 grid grid-cols-2 gap-2 h-full">
          {Object.values(themes).map((theme) => (
            <ThemeCard
              isBuiltin={Boolean(builtinThemes[theme.id])}
              theme={theme}
              selected={selectedThemeId === theme.id}
              onSelect={() => handleSelectTheme(theme.id)}
              hasOverrides={hasOverrides}
              key={theme.id}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
