import { CheckCircle2, WandIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { builtinThemes } from "@/lib/themes";
import { ConfirmApplyThemeToAll } from "./ConfirmApplyToAll";
import { ConfirmChangeTheme } from "./ConfirmChangeTheme";
import { ConfirmDeleteTheme } from "./ConfirmDeleteTheme";
import { ThemeCard } from "./ThemeCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteCustomThemeMutation } from "@/hooks/useDeleteCustomThemeMutation";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useThemes } from "@/hooks/useThemes";

interface Props {
  onSelectTheme: (themeId: string) => void;
  selectedThemeId: string;
  onCustomize: () => void;
  hasOverrides: boolean;
}

export function ThemeSelection(props: Props) {
  const { applyThemeToAll } = useEditCraftStore((s) => ({
    applyThemeToAll: s.applyThemeToAll,
  }));
  const [showThemeChangeConfirmation, setShowThemeChangeConfirmation] =
    useState(false);

  const [showConfirmApplyToAll, setShowConfirmApplyToAll] = useState(false);
  const [themeToApplyToAll, setThemeToApplyToAll] = useState<string | null>(
    null
  );

  const [showConfirmDeleteTheme, setShowConfirmDeleteTheme] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);

  const [confirmThemeId, setConfirmThemeId] = useState<string | null>(null);
  const { onSelectTheme, hasOverrides, selectedThemeId, onCustomize } = props;

  const themes = useThemes();
  const deleteCustomThemeMutation = useDeleteCustomThemeMutation();

  const handleSelectTheme = (themeId: string) => {
    if (selectedThemeId !== themeId && hasOverrides) {
      setShowThemeChangeConfirmation(true);
      setConfirmThemeId(themeId);
      return;
    }

    if (selectedThemeId === themeId) {
      return;
    }

    onSelectTheme(themeId);
  };

  const handleConfirmThemeChange = () => {
    if (confirmThemeId) {
      onSelectTheme(confirmThemeId);
    }

    setShowThemeChangeConfirmation(false);
  };

  const handleConfirmApplyToAll = () => {
    if (themeToApplyToAll) {
      applyThemeToAll(themeToApplyToAll);
      setThemeToApplyToAll(null);
      toast.success("Theme applied to all pages", {
        icon: <CheckCircle2 />,
      });
    }
  };

  const handleConfirmDeleteTheme = () => {
    if (themeToDelete) {
      deleteCustomThemeMutation.mutate(themeToDelete, {
        onSuccess: () => {
          toast.success("Theme deleted", {
            icon: <CheckCircle2 />,
            description: "This theme has been deleted.",
          });
        },
      });

      setThemeToDelete(null);
    }
  };

  const forceDefaultThemeSelected = themes[selectedThemeId] === undefined;

  return (
    <>
      <ConfirmChangeTheme
        open={showThemeChangeConfirmation}
        onOpenChange={setShowThemeChangeConfirmation}
        onConfirm={handleConfirmThemeChange}
      />

      <ConfirmApplyThemeToAll
        open={showConfirmApplyToAll}
        onOpenChange={setShowConfirmApplyToAll}
        onConfirm={handleConfirmApplyToAll}
      />

      <ConfirmDeleteTheme
        open={showConfirmDeleteTheme}
        onOpenChange={setShowConfirmDeleteTheme}
        onConfirm={handleConfirmDeleteTheme}
      />

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
              selected={
                selectedThemeId === theme.id ||
                (forceDefaultThemeSelected && theme.id === "default")
              }
              onSelect={() => handleSelectTheme(theme.id)}
              onApplyToAll={() => {
                setThemeToApplyToAll(theme.id);
                setShowConfirmApplyToAll(true);
              }}
              onDelete={() => {
                setThemeToDelete(theme.id);
                setShowConfirmDeleteTheme(true);
              }}
              hasOverrides={hasOverrides}
              key={theme.id}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
