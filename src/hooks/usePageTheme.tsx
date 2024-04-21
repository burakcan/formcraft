import { defaultTheme } from "@/lib/themes/defaultTheme";
import { useEditCraftStore } from "./useEditCraftStore";
import { useThemes } from "./useThemes";

export function usePageTheme(pageId: string) {
  const page = useEditCraftStore((s) =>
    s.editingVersion?.data.pages.find((page) => page.id === pageId)
  );

  const themes = useThemes();

  const baseTheme = (page && themes[page.baseThemeId]) || defaultTheme;
  const overrides = page?.themeOverride || {};

  const theme = { ...baseTheme, ...overrides };

  return theme;
}
