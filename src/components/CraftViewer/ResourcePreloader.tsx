import FontPicker from "react-fontpicker-ts";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  pages: FormCraft.CraftPage[];
  themes: Record<string, CraftTheme>;
  enabled: boolean;
}

function PageResourcePreloader(props: {
  theme: CraftTheme;
  page: FormCraft.CraftPage;
}) {
  const { page, theme } = props;
  useLoadPageResources(page, theme);

  if ("document" in global) {
    return (
      <>
        <FontPicker
          loaderOnly
          loadFonts={[theme.titleFont, theme.descriptionFont]}
          loadAllVariants
        />
      </>
    );
  }

  return null;
}

export function ResourcePreloader(props: Props) {
  const { pages, themes, enabled } = props;

  return enabled
    ? pages.map((page) => {
        const baseTheme = themes[page.baseThemeId];
        const theme = {
          ...baseTheme,
          ...page.themeOverride,
        };

        return (
          <PageResourcePreloader key={page.id} theme={theme} page={page} />
        );
      })
    : null;
}
