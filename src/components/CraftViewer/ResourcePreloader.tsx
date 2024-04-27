import type { CraftTheme } from "@/craftPages/schemas/theming";
import { useLoadPageResources } from "@/hooks/useLoadPageResources";

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

  return (
    <>
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.titleFont}&display=swap`}
        rel="stylesheet"
      />
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.descriptionFont}&display=swap`}
        rel="stylesheet"
      />
    </>
  );
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
